// Meta logo "f" mark as SVG path data
const META_LOGO_SVG = `
<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="28" cy="28" r="28" fill="white" fill-opacity="0.2"/>
  <path d="M38.5 14H34.0C31.7 14 29.6 14.8 27.9 16.5C26.3 18.2 25.5 20.3 25.5 22.5V26.9H21V32.5H25.5V43.7H30.9V32.5H35.6L36.9 26.9H30.9V22.5C30.9 22.1 31.1 21.7 31.3 21.4C31.6 21.1 32.0 21.0 32.3 21.0H38.5V14Z" fill="white"/>
</svg>
`;

figma.showUI(__html__, { width: 320, height: 440 });

// Send file name to the UI once it's ready
function sendInit() {
  figma.ui.postMessage({
    type: 'init',
    fileName: figma.root.name,
  });
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  };
}

const gradients: Record<string, { from: {r: number; g: number; b: number}; to: {r: number; g: number; b: number} }> = {
  blue:   { from: { r: 8/255, g: 102/255, b: 255/255 }, to: { r: 59/255, g: 158/255, b: 255/255 } },
  purple: { from: { r: 108/255, g: 43/255, b: 217/255 }, to: { r: 184/255, g: 110/255, b: 255/255 } },
  green:  { from: { r: 0/255, g: 135/255, b: 90/255 },  to: { r: 54/255, g: 179/255, b: 126/255 } },
  dark:   { from: { r: 28/255, g: 30/255, b: 33/255 },   to: { r: 58/255, g: 61/255, b: 66/255 } },
  sunset: { from: { r: 232/255, g: 69/255, b: 60/255 },  to: { r: 245/255, g: 166/255, b: 35/255 } },
  ocean:  { from: { r: 0/255, g: 97/255, b: 255/255 },   to: { r: 0/255, g: 212/255, b: 170/255 } },
};

async function createCoverOnPage(
  page: PageNode,
  msg: { team: string; badge: string; contributors: string; gradient: string; customFrom: string; customTo: string },
  fontRegular: FontName,
  fontBold: FontName,
  grad: { from: {r: number; g: number; b: number}; to: {r: number; g: number; b: number} },
): Promise<FrameNode> {
  await figma.setCurrentPageAsync(page);

  // Capture existing children before creating the cover
  const existingNodes = [...page.children];

  const cover = figma.createFrame();
  cover.name = 'Cover';
  cover.resize(1920, 1080);
  if (existingNodes.length > 0) {
    let minX = Infinity;
    let minY = Infinity;
    for (const node of existingNodes) {
      if (node.x < minX) minX = node.x;
      if (node.y < minY) minY = node.y;
    }
    cover.x = minX;
    cover.y = minY - 1080 - 100;
  } else {
    cover.x = 0;
    cover.y = 0;
  }

  cover.fills = [
    {
      type: 'GRADIENT_LINEAR',
      gradientStops: [
        { position: 0, color: { ...grad.from, a: 1 } },
        { position: 1, color: { ...grad.to, a: 1 } },
      ],
      gradientTransform: [
        [1, 0, 0],
        [0, 1, 0],
      ],
    },
  ];

  const PAD_LEFT = 100;
  const PAD_RIGHT = 100;
  const PAD_TOP = 80;
  const PAD_BOTTOM = 80;

  // Meta logo (SVG node) — top-left
  const logoNode = figma.createNodeFromSvg(META_LOGO_SVG);
  logoNode.name = 'Meta Logo';
  logoNode.x = PAD_LEFT;
  logoNode.y = PAD_TOP;
  cover.appendChild(logoNode);

  // Team header text — next to logo
  const teamText = figma.createText();
  teamText.fontName = fontRegular;
  teamText.characters = msg.team;
  teamText.fontSize = 36;
  teamText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  teamText.x = PAD_LEFT + 72;
  teamText.y = PAD_TOP + 14;
  cover.appendChild(teamText);

  // Project title (file name) — vertically centered
  const fileName = figma.root.name;
  const titleText = figma.createText();
  titleText.fontName = fontBold;
  titleText.characters = fileName;
  titleText.fontSize = 96;
  titleText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  titleText.x = PAD_LEFT;
  titleText.resize(1920 - PAD_LEFT - PAD_RIGHT, titleText.height);
  titleText.textAutoResize = 'HEIGHT';
  const titleBlockHeight = titleText.height + 32 + 52;
  const titleStartY = (1080 - titleBlockHeight) / 2;
  titleText.y = titleStartY;
  cover.appendChild(titleText);

  // Badge pill — below title
  const badgeGroup = figma.createFrame();
  badgeGroup.name = 'Badge';
  badgeGroup.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  badgeGroup.cornerRadius = 24;
  badgeGroup.layoutMode = 'HORIZONTAL';
  badgeGroup.primaryAxisAlignItems = 'CENTER';
  badgeGroup.counterAxisAlignItems = 'CENTER';
  badgeGroup.paddingLeft = 24;
  badgeGroup.paddingRight = 28;
  badgeGroup.paddingTop = 14;
  badgeGroup.paddingBottom = 14;
  badgeGroup.primaryAxisSizingMode = 'AUTO';
  badgeGroup.counterAxisSizingMode = 'AUTO';
  badgeGroup.itemSpacing = 12;

  const badgeIcon = figma.createEllipse();
  badgeIcon.name = 'Badge Icon';
  badgeIcon.resize(24, 24);
  badgeIcon.fills = [{ type: 'SOLID', color: grad.from }];
  badgeGroup.appendChild(badgeIcon);

  const badgeText = figma.createText();
  badgeText.fontName = fontBold;
  badgeText.characters = msg.badge;
  badgeText.fontSize = 28;
  badgeText.fills = [{ type: 'SOLID', color: grad.from }];
  badgeGroup.appendChild(badgeText);

  badgeGroup.x = PAD_LEFT;
  badgeGroup.y = titleText.y + titleText.height + 32;
  cover.appendChild(badgeGroup);

  // Contributors bar at bottom-left
  if (msg.contributors.trim()) {
    const contribBar = figma.createFrame();
    contribBar.name = 'Contributors Bar';
    contribBar.resize(1920, 72);
    contribBar.x = 0;
    contribBar.y = 1080 - 72;
    contribBar.fills = [
      { type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.12 },
    ];
    cover.appendChild(contribBar);

    const contribText = figma.createText();
    contribText.fontName = fontRegular;
    contribText.characters = `Design POC's: ${msg.contributors}`;
    contribText.fontSize = 28;
    contribText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    contribText.x = PAD_LEFT;
    contribText.y = 1080 - 72 + 22;
    cover.appendChild(contribText);
  }

  // Date — bottom-right
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const now = new Date();
  const dateStr = `${months[now.getMonth()]} ${now.getFullYear()}`;

  const dateText = figma.createText();
  dateText.fontName = fontBold;
  dateText.characters = dateStr;
  dateText.fontSize = 64;
  dateText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  const dateBottomOffset = msg.contributors.trim() ? 72 : 0;
  dateText.x = 1920 - PAD_RIGHT - dateText.width;
  dateText.y = 1080 - PAD_BOTTOM - dateText.height - dateBottomOffset;
  cover.appendChild(dateText);

  // Move cover to the front (first child)
  page.insertChild(0, cover);

  return cover;
}

figma.ui.onmessage = async (msg: {
  type: string;
  team: string;
  badge: string;
  contributors: string;
  gradient: string;
  customFrom: string;
  customTo: string;
}) => {
  if (msg.type === 'ui-ready') {
    sendInit();
    return;
  }
  if (msg.type !== 'generate') return;

  try {
    const page = figma.currentPage;

    // Load fonts — try Facebook Sans first, fall back to Inter
    let fontRegular: FontName = { family: 'Inter', style: 'Regular' };
    let fontBold: FontName = { family: 'Inter', style: 'Bold' };

    try {
      await figma.loadFontAsync({ family: 'Facebook Sans', style: 'Regular' });
      await figma.loadFontAsync({ family: 'Facebook Sans', style: 'Bold' });
      fontRegular = { family: 'Facebook Sans', style: 'Regular' };
      fontBold = { family: 'Facebook Sans', style: 'Bold' };
    } catch {
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
      await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
    }

    const grad = msg.gradient === 'custom'
      ? { from: hexToRgb(msg.customFrom), to: hexToRgb(msg.customTo) }
      : (gradients[msg.gradient] || gradients.blue);

    const cover = await createCoverOnPage(page, msg, fontRegular, fontBold, grad);

    figma.currentPage.selection = [cover];
    figma.viewport.scrollAndZoomIntoView([cover]);

    try {
      await figma.setFileThumbnailNodeAsync(cover);
    } catch {
      // Thumbnail setting is optional — ignore failures
    }

    try {
      await figma.saveVersionHistoryAsync('Cover generated');
    } catch {
      // Version history save is optional — ignore failures
    }

    figma.notify('Cover generated!');
  } catch (err: any) {
    figma.notify(`Error: ${err?.message || err}`, { error: true });
  }
};
