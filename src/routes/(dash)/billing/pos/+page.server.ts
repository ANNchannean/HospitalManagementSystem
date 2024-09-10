import { preBilling } from "$lib/server/models";
import type { PageServerLoad } from "./$types";

export const load:PageServerLoad = async () => {
    await preBilling({ visit_id: visit_id, progress_id: null, checkin_type: 'OPD' });
  

 
}