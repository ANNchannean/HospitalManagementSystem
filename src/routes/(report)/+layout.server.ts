import { db } from '$lib/server/db'
import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async () => {
	const get_clinic_info = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});
	
	return {
		get_clinic_info: get_clinic_info,
		
	};
};
