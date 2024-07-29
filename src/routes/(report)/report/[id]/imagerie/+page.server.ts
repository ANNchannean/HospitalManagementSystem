import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import QRCode from 'qrcode';
import { imagerieRequest } from '$lib/server/schema';
export const load: PageServerLoad = async ({ params, url }) => {
	const imagerie_request_id = params.id;
	const get_imagerie_request = await db.query.imagerieRequest.findFirst({
		with: {
			visit: {
				with: {
					patient: {
						with: {
							commune: true,
							district: true,
							provice: true,
							village: true
						}
					},
					staff: true
				}
			},
			product: true,
			fileOrPicture: true
		},
		where: eq(imagerieRequest.id, +imagerie_request_id || 0)
	});

	const get_clinic_info = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});
	const generateQR = async (text: string) => {
		try {
			// console.log(await QRCode.toDataURL(text));
			return await QRCode.toDataURL(text);
		} catch (err) {
			console.error(err);
		}
	};
	return {
		url_qr: await generateQR(url.href),
		get_imagerie_request,
		get_clinic_info
	};
};
