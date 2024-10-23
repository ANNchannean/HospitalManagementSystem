import { db } from '$lib/server/db';
import { and, asc, eq, like, notLike, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { paymentType, product, progressNote } from '$lib/server/schemas';
import { setChargePrice, updateCharge } from '$lib/server/models';
export const load: PageServerLoad = async ({ url, params }) => {
	const { id: progress_node_id } = params;
	const get_currency = await db.query.currency.findFirst({});
	const group_type_id = url.searchParams.get('group_type_id') || '';
	const q = url.searchParams.get('q') || '';
	const get_progress_note = await db.query.progressNote.findFirst({
		where: eq(progressNote.id, +progress_node_id),
		with: {
			
			billing: {
				with: {
					payment: {
						with: {
							paymentType: true
						}
					},
					patient: true,
					visit: {
						with: {
							presrciption: {
								with: {
									product: true
								}
							}
						}
					},
					progressNote: {
						with: {
							presrciption: {
								with: {
									product: true
								}
							}
						}
					},
					charge: {
						with: {
							productOrder: {
								with: {
									product: true
								}
							}
						}
					}
				}
			},
			patient: true,
			visit: {
				with: {
					billing: {
						with: {
							payment: {
								with: {
									paymentType: true
								}
							},
							patient: true,
							visit: {
								with: {
									presrciption: {
										with: {
											product: true
										}
									}
								}
							},
							progressNote: {
								with: {
									presrciption: {
										with: {
											product: true
										}
									}
								}
							},
							charge: {
								with: {
									productOrder: {
										with: {
											product: true
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
	const get_product_group_type = await db.query.productGroupType.findMany({
		with: {
			unit: true
		}
	});
	const get_products = await db.query.product.findMany({
		where: and(
			group_type_id ? eq(product.group_type_id, +group_type_id) : undefined,
			or(like(product.products, `%${q}%`))
		),
		with: {
			unit: true,
			parameter: true,
			productGroupType: true,
			fileOrPicture: true
		},
		orderBy: asc(product.products),
		limit: 200
	});

	const get_payment_types = await db.query.paymentType.findMany({
		orderBy: asc(paymentType.by),
		where: notLike(paymentType.by, '%CASH%')
	});

	async function totalDaily() {
		const charge_on_prescription = get_progress_note?.billing?.charge.find(
			(e) => e.charge_on === 'prescription'
		);
		if (get_progress_note?.inclund_pay === 'none') {
			await setChargePrice(charge_on_prescription?.id, 0);
			return 0;
		}
		if (get_progress_note?.inclund_pay === 'treatment') {
			await setChargePrice(charge_on_prescription?.id, 0);
			return get_progress_note?.visit.reduce(
				(s, e) => s + (Number(e.billing?.total) - Number(e.billing?.paid)),
				0
			);
		}
		if (get_progress_note?.inclund_pay === 'prescription') {
			await updateCharge(charge_on_prescription?.id);
			return 0;
		}
		if (get_progress_note?.inclund_pay === 'tre_and_pre') {
			await updateCharge(charge_on_prescription?.id);
			return get_progress_note?.visit.reduce(
				(s, e) => s + (Number(e.billing?.total) - Number(e.billing?.paid)),
				0
			);
		}
	}
	return {
		get_products,
		get_product_group_type,
		get_payment_types,
		get_progress_note,
		get_currency,
		total_daily: await totalDaily()
	};
};
