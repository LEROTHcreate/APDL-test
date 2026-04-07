/**
 * Utilitaire de génération PDF côté client
 * Utilise html2canvas pour capturer un élément DOM et jsPDF pour générer le fichier.
 * Import dynamique pour éviter le SSR.
 */

export interface PdfOptions {
  /** Résolution du rendu (défaut 2 pour retina) */
  scale?: number;
  /** Orientation du document */
  orientation?: "portrait" | "landscape";
}

/**
 * Capture un élément DOM par son id et le télécharge en PDF A4.
 * Gère automatiquement les documents multi-pages.
 */
export async function downloadElementAsPdf(
  elementId: string,
  filename: string,
  options: PdfOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Élément #${elementId} introuvable`);

  const { scale = 2, orientation = "portrait" } = options;

  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    removeContainer: true,
  });

  const pdf = new jsPDF({ orientation, unit: "px", format: "a4" });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const imgW = pageW;
  const imgH = (canvas.height * pageW) / canvas.width;

  let heightLeft = imgH;
  let yOffset = 0;

  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, yOffset, imgW, imgH);
  heightLeft -= pageH;

  while (heightLeft > 0) {
    yOffset -= pageH;
    pdf.addPage();
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, yOffset, imgW, imgH);
    heightLeft -= pageH;
  }

  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}

/** Génère le nom de fichier normalisé pour une facture */
export function factureFilename(numero: string, patientNom: string): string {
  const clean = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_");
  return `Facture_${clean(numero)}_${clean(patientNom)}`;
}

/** Génère le nom de fichier normalisé pour un devis */
export function devisFilename(numero: string, patientNom: string): string {
  const clean = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_");
  return `Devis_${clean(numero)}_${clean(patientNom)}`;
}
