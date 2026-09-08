import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MONTH_NAMES, WEEKDAYS_SUNDAY_START, generateMonthMatrix, formatDateKey } from '../core/utils/date_utils';
import { JournalEntry } from '../features/calendar/models/entry_model';

// Direct device download trigger via native Blob URL
export function downloadBlobToDevice(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 1000);
}

// Helper to create a styled DOM container for a month's visual calendar page
function createMonthCalendarDOM(
  year: number,
  month: number,
  entriesMap: Map<string, JournalEntry>
): HTMLElement {
  const monthName = MONTH_NAMES[month - 1];
  const matrix = generateMonthMatrix(year, month, entriesMap, false);

  // Exact A4 landscape ratio (1400px x 990px ≈ 1.4142)
  const container = document.createElement('div');
  container.style.width = '1400px';
  container.style.height = '990px';
  container.style.padding = '32px 36px';
  container.style.backgroundColor = '#FFFFFF';
  container.style.color = '#0F172A';
  container.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  container.style.boxSizing = 'border-box';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';
  container.style.position = 'relative';

  // Header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.borderBottom = '2px solid #E2E8F0';
  header.style.paddingBottom = '14px';
  header.style.marginBottom = '14px';

  const titleGroup = document.createElement('div');
  titleGroup.style.display = 'flex';
  titleGroup.style.alignItems = 'center';
  titleGroup.style.gap = '14px';

  // App Logo icon
  const logoImg = document.createElement('img');
  logoImg.src = '/calendo-icon.svg';
  logoImg.style.width = '42px';
  logoImg.style.height = '42px';
  logoImg.style.borderRadius = '10px';
  logoImg.style.objectFit = 'cover';
  titleGroup.appendChild(logoImg);

  const titleTextWrap = document.createElement('div');
  const title = document.createElement('h1');
  title.textContent = `${monthName} ${year}`;
  title.style.margin = '0';
  title.style.fontSize = '32px';
  title.style.fontWeight = '900';
  title.style.color = '#0F172A';
  title.style.letterSpacing = '-0.03em';
  title.style.lineHeight = '1';

  const subtitle = document.createElement('div');
  subtitle.textContent = 'Calendo • Visual Diary & Memory Journal';
  subtitle.style.fontSize = '12px';
  subtitle.style.fontWeight = '600';
  subtitle.style.color = '#64748B';
  subtitle.style.marginTop = '4px';

  titleTextWrap.appendChild(title);
  titleTextWrap.appendChild(subtitle);
  titleGroup.appendChild(titleTextWrap);

  const stats = document.createElement('div');
  let filledCount = 0;
  matrix.days.forEach((d) => {
    if (d.isCurrentMonth && d.entry?.image_path) filledCount++;
  });
  const daysInMonth = matrix.days.filter((d) => d.isCurrentMonth).length;

  stats.style.textAlign = 'right';
  stats.innerHTML = `
    <div style="font-size: 15px; font-weight: 800; color: #FF5E62;">${filledCount} / ${daysInMonth} Days Documented</div>
    <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">Exported on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
  `;

  header.appendChild(titleGroup);
  header.appendChild(stats);
  container.appendChild(header);

  // Weekdays Row
  const weekdaysGrid = document.createElement('div');
  weekdaysGrid.style.display = 'grid';
  weekdaysGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
  weekdaysGrid.style.gap = '8px';
  weekdaysGrid.style.marginBottom = '8px';
  weekdaysGrid.style.textAlign = 'center';

  WEEKDAYS_SUNDAY_START.forEach((dayName) => {
    const dayCell = document.createElement('div');
    dayCell.textContent = dayName;
    dayCell.style.fontSize = '12px';
    dayCell.style.fontWeight = '800';
    dayCell.style.color = '#475569';
    dayCell.style.textTransform = 'uppercase';
    dayCell.style.letterSpacing = '0.06em';
    weekdaysGrid.appendChild(dayCell);
  });
  container.appendChild(weekdaysGrid);

  // Calendar Grid (Calculates row count: 5 or 6 rows)
  const rowCount = Math.ceil(matrix.days.length / 7);
  const calendarGrid = document.createElement('div');
  calendarGrid.style.display = 'grid';
  calendarGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
  calendarGrid.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`;
  calendarGrid.style.gap = '8px';
  calendarGrid.style.flex = '1';
  calendarGrid.style.minHeight = '0'; // Prevent grid overflow

  matrix.days.forEach((day) => {
    const cell = document.createElement('div');
    cell.style.position = 'relative';
    cell.style.borderRadius = '12px';
    cell.style.border = day.isCurrentMonth ? '1.5px solid #E2E8F0' : '1px dashed #E2E8F0';
    cell.style.backgroundColor = day.isCurrentMonth ? '#F8FAFC' : '#FFFFFF';
    cell.style.opacity = day.isCurrentMonth ? '1' : '0.25';
    cell.style.overflow = 'hidden';
    cell.style.display = 'flex';
    cell.style.flexDirection = 'column';
    cell.style.boxSizing = 'border-box';

    // Date stamp
    const dateBadge = document.createElement('div');
    dateBadge.textContent = String(day.dayNumber);
    dateBadge.style.position = 'absolute';
    dateBadge.style.top = '6px';
    dateBadge.style.left = '8px';
    dateBadge.style.fontSize = '11px';
    dateBadge.style.fontWeight = '800';
    dateBadge.style.zIndex = '5';

    if (day.entry?.image_path) {
      dateBadge.style.color = '#FFFFFF';
      dateBadge.style.backgroundColor = 'rgba(0, 0, 0, 0.45)';
      dateBadge.style.padding = '1px 5px';
      dateBadge.style.borderRadius = '5px';
    } else {
      dateBadge.style.color = '#0F172A';
    }
    cell.appendChild(dateBadge);

    // Indicators (Heart / Mood)
    if (day.entry?.is_favorite || day.entry?.mood_emoji) {
      const ind = document.createElement('div');
      ind.style.position = 'absolute';
      ind.style.top = '5px';
      ind.style.right = '6px';
      ind.style.fontSize = '10px';
      ind.style.zIndex = '5';
      ind.style.display = 'flex';
      ind.style.gap = '3px';
      if (day.entry.is_favorite) {
        ind.innerHTML += '<span style="color: #FF3B30;">❤️</span>';
      }
      if (day.entry.mood_emoji) {
        ind.innerHTML += `<span>${day.entry.mood_emoji}</span>`;
      }
      cell.appendChild(ind);
    }

    // Photo or Sticker Image
    if (day.entry?.image_path) {
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'absolute';
      imgContainer.style.inset = '0';
      imgContainer.style.display = 'flex';
      imgContainer.style.alignItems = 'center';
      imgContainer.style.justifyContent = 'center';
      imgContainer.style.overflow = 'hidden';

      const isSticker = day.entry.is_sticker_cutout ?? true;
      const scale = day.entry.image_scale ?? 1.0;
      const rotation = day.entry.image_rotation ?? 0;
      const offsetX = day.entry.image_offset_x ?? 0;
      const offsetY = day.entry.image_offset_y ?? 0;

      if (!isSticker) {
        const bgImg = document.createElement('img');
        bgImg.src = day.entry.image_path;
        bgImg.crossOrigin = 'anonymous';
        bgImg.style.position = 'absolute';
        bgImg.style.inset = '-10px';
        bgImg.style.width = 'calc(100% + 20px)';
        bgImg.style.height = 'calc(100% + 20px)';
        bgImg.style.objectFit = 'cover';
        bgImg.style.filter = 'blur(10px) brightness(0.95)';
        bgImg.style.opacity = '0.55';
        imgContainer.appendChild(bgImg);
      }

      const img = document.createElement('img');
      img.src = day.entry.image_path;
      img.crossOrigin = 'anonymous';
      img.style.position = 'relative';
      img.style.maxWidth = isSticker ? '80%' : '100%';
      img.style.maxHeight = isSticker ? '80%' : '100%';
      img.style.objectFit = 'contain';
      img.style.transform = `translate(${offsetX * 0.8}px, ${offsetY * 0.8}px) scale(${scale}) rotate(${rotation}deg)`;
      img.style.zIndex = '2';
      imgContainer.appendChild(img);

      cell.appendChild(imgContainer);
    }

    // Tasks list at bottom
    if (day.entry?.tasks && day.entry.tasks.length > 0) {
      const taskBox = document.createElement('div');
      taskBox.style.position = 'absolute';
      taskBox.style.bottom = '4px';
      taskBox.style.left = '4px';
      taskBox.style.right = '4px';
      taskBox.style.zIndex = '6';
      taskBox.style.display = 'flex';
      taskBox.style.flexDirection = 'column';
      taskBox.style.gap = '2px';

      day.entry.tasks.slice(0, 1).forEach((t) => {
        const item = document.createElement('div');
        item.style.fontSize = '8px';
        item.style.fontWeight = '600';
        item.style.color = '#1E293B';
        item.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        item.style.padding = '1.5px 5px';
        item.style.borderRadius = '4px';
        item.style.whiteSpace = 'nowrap';
        item.style.overflow = 'hidden';
        item.style.textOverflow = 'ellipsis';
        item.textContent = `${t.is_completed ? '✓ ' : '• '}${t.content}`;
        taskBox.appendChild(item);
      });
      cell.appendChild(taskBox);
    }

    calendarGrid.appendChild(cell);
  });

  container.appendChild(calendarGrid);

  // Footer
  const footer = document.createElement('div');
  footer.style.marginTop = '12px';
  footer.style.display = 'flex';
  footer.style.justifyContent = 'space-between';
  footer.style.fontSize = '11px';
  footer.style.color = '#94A3B8';
  footer.style.borderTop = '1px solid #E2E8F0';
  footer.style.paddingTop = '8px';
  footer.innerHTML = `
    <span>Calendo Visual Calendar & Journal • Designed by R Rajkumar Padmanabhan</span>
    <span>Page ${month} • ${monthName} ${year}</span>
  `;
  container.appendChild(footer);

  return container;
}

// Export single month to PDF with exact A4 landscape scaling
export async function exportMonthToPDF(
  year: number,
  month: number,
  entriesMap: Map<string, JournalEntry>,
  onProgress?: (status: string) => void
): Promise<void> {
  onProgress?.(`Rendering ${MONTH_NAMES[month - 1]} ${year}...`);

  const hiddenHost = document.createElement('div');
  hiddenHost.style.position = 'fixed';
  hiddenHost.style.left = '-9999px';
  hiddenHost.style.top = '0';
  hiddenHost.style.width = '1400px';
  hiddenHost.style.height = '990px';
  document.body.appendChild(hiddenHost);

  try {
    const dom = createMonthCalendarDOM(year, month, entriesMap);
    hiddenHost.appendChild(dom);

    // Wait for images and SVG fonts to settle
    await new Promise((resolve) => setTimeout(resolve, 400));

    onProgress?.('Generating high-resolution print PDF...');
    const canvas = await html2canvas(dom, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false,
      width: 1400,
      height: 990,
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    const pdfBlob = pdf.output('blob');
    downloadBlobToDevice(pdfBlob, `calendo-journal-${MONTH_NAMES[month - 1]}-${year}.pdf`);
    onProgress?.('Complete!');
  } finally {
    document.body.removeChild(hiddenHost);
  }
}

// Export entire 12-month year to PDF with exact A4 landscape scaling
export async function exportYearToPDF(
  year: number,
  entriesMap: Map<string, JournalEntry>,
  onProgress?: (status: string, current: number, total: number) => void
): Promise<void> {
  const hiddenHost = document.createElement('div');
  hiddenHost.style.position = 'fixed';
  hiddenHost.style.left = '-9999px';
  hiddenHost.style.top = '0';
  hiddenHost.style.width = '1400px';
  hiddenHost.style.height = '990px';
  document.body.appendChild(hiddenHost);

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

    for (let m = 1; m <= 12; m++) {
      onProgress?.(`Rendering ${MONTH_NAMES[m - 1]} (${m}/12)...`, m, 12);
      hiddenHost.innerHTML = '';

      const dom = createMonthCalendarDOM(year, m, entriesMap);
      hiddenHost.appendChild(dom);

      await new Promise((resolve) => setTimeout(resolve, 350));

      const canvas = await html2canvas(dom, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        width: 1400,
        height: 990,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      if (m > 1) {
        pdf.addPage('a4', 'landscape');
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    onProgress?.('Finalizing Complete Year PDF...', 12, 12);
    const pdfBlob = pdf.output('blob');
    downloadBlobToDevice(pdfBlob, `calendo-journal-${year}-full-year.pdf`);
    onProgress?.('Complete!', 12, 12);
  } finally {
    document.body.removeChild(hiddenHost);
  }
}
