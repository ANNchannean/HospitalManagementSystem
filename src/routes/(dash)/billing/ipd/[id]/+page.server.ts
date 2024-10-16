import { db } from '$lib/server/db';
import { and, asc, eq, like, notLike, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { billing, paymentType, product, progressNote } from '$lib/server/schemas';
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
	const get_billings = await db.query.billing.findMany({
		where: and(eq(billing.status, 'debt'), eq(billing.billing_type, 'OPD')),
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
	});

	const get_payment_types = await db.query.paymentType.findMany({
		orderBy: asc(paymentType.by),
		where: notLike(paymentType.by, '%CASH%')
	});
	const get_tax = await db.query.tax.findFirst();
	return {
		get_billings,
		get_products,
		get_product_group_type,
		get_payment_types,
		get_tax,
		get_progress_note,
		get_currency
	};
};
