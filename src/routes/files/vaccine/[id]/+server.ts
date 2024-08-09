import { jsPDF } from 'jspdf';
import type { RequestHandler } from './$types';
import '$lib/server/font/KhmerOSbattambang-normal.js';
import '$lib/server/font/KhmerOSMoulLight-normal.js';
import '$lib/server/font/KhmerOSmuol-normal';
import { db } from '$lib/server/db';
import fs from 'fs';
import path from 'path';
export const GET: RequestHandler = async ({ params }) => {
	const dirname = process.cwd();
	const get_clinichinfo = await db.query.clinicinfo.findFirst({
		with: {
			fileOrPicture: true
		}
	});
	const logo1 = fs.readFileSync(
		path.join(dirname, 'files', get_clinichinfo?.fileOrPicture[0]?.filename ?? '')
	);
	const logo2 = fs.readFileSync(
		path.join(dirname, 'files', get_clinichinfo?.fileOrPicture[1]?.filename ?? '')
	);
	const { id } = params;
	const doc = new jsPDF('p', 'mm', 'a4');
	// retrieve the original buffer of data
	const imgsrc = '/files/20240729000847-4g0u8fm95o.jpeg';
	const dataURL = 'data:image/jpeg;base64,'.concat(logo1.toString('base64'));
	// doc.addFileToVFS("KhmerOSbattambang-normal.ttf", 'KhmerOSBattambang');
	doc.addFont('KhmerOSbattambang-normal.ttf', 'KhmerOSBattambang', 'normal');
	doc.addFont('KhmerOSMoulLight-normal.ttf', 'KhmerOSMoulLight', 'normal');
	doc.addFont('KhmerOSmuol-normal.ttf', 'KhmerOSmuol', 'normal');
	doc.setFont('KhmerOSBattambang');
	doc.text('សដសា', 10, 10);
	doc.addPage();
	doc.addImage(dataURL, 'JPEG', 15, 40, 180, 160);
	doc.text('ដសដស', 10, 10);
	doc.save('pdf.pdf')
	const pageCount = doc.getNumberOfPages();
	for (let i = 1; i <= pageCount; i++) {
		doc.setPage(i);
		doc.text(`Page ${i} + Of ${pageCount}`, 210 - 50, 297 - 20);
	}
	doc.addPage();
	// const file = dataURL;
	console.log(dataURL);

	const file = doc.output('dataurlstring');
	// setHeaders({
	// 	'Content-Type': get_file?.mimeType ?? '',
	// 	'Content-Length': get_file?.size?.toString() ?? '',
	// 	'Last-Modified': get_file?.lastModified?.toString() ?? '',
	// 	'Cache-Control': 'public, max-age=600'
	// });
	return new Response(file);
};
