"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Meta logo "f" mark as SVG path data
const META_LOGO_SVG = `
<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="28" cy="28" r="28" fill="white" fill-opacity="0.2"/>
  <path d="M38.5 14H34.0C31.7 14 29.6 14.8 27.9 16.5C26.3 18.2 25.5 20.3 25.5 22.5V26.9H21V32.5H25.5V43.7H30.9V32.5H35.6L36.9 26.9H30.9V22.5C30.9 22.1 31.1 21.7 31.3 21.4C31.6 21.1 32.0 21.0 32.3 21.0H38.5V14Z" fill="white"/>
</svg>
`;
figma.showUI(__html__, { width: 320, height: 560 });
// Send file name and page list to the UI
const pages = figma.root.children.map(page => ({ id: page.id, name: page.name }));
figma.ui.postMessage({
    type: 'init',
    fileName: figma.root.name,
    pages,
    currentPageId: figma.currentPage.id,
});
function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.substring(0, 2), 16) / 255,
        g: parseInt(h.substring(2, 4), 16) / 255,
        b: parseInt(h.substring(4, 6), 16) / 255,
    };
}
const gradients = {
    blue: { from: { r: 8 / 255, g: 102 / 255, b: 255 / 255 }, to: { r: 59 / 255, g: 158 / 255, b: 255 / 255 } },
    purple: { from: { r: 108 / 255, g: 43 / 255, b: 217 / 255 }, to: { r: 184 / 255, g: 110 / 255, b: 255 / 255 } },
    green: { from: { r: 0 / 255, g: 135 / 255, b: 90 / 255 }, to: { r: 54 / 255, g: 179 / 255, b: 126 / 255 } },
    dark: { from: { r: 28 / 255, g: 30 / 255, b: 33 / 255 }, to: { r: 58 / 255, g: 61 / 255, b: 66 / 255 } },
    sunset: { from: { r: 232 / 255, g: 69 / 255, b: 60 / 255 }, to: { r: 245 / 255, g: 166 / 255, b: 35 / 255 } },
    ocean: { from: { r: 0 / 255, g: 97 / 255, b: 255 / 255 }, to: { r: 0 / 255, g: 212 / 255, b: 170 / 255 } },
};
function createCoverOnPage(page, msg, fontRegular, fontBold, grad) {
    figma.currentPage = page;
    const cover = figma.createFrame();
    cover.name = 'Cover';
    cover.resize(1920, 1080);
    // Position at origin or offset from existing content
    const nodes = page.children;
    if (nodes.length > 0) {
        let minX = Infinity;
        let minY = Infinity;
        for (const node of nodes) {
            if (node.x < minX)
                minX = node.x;
            if (node.y < minY)
                minY = node.y;
        }
        cover.x = minX;
        cover.y = minY - 1080 - 100;
    }
    else {
        cover.x = 0;
        cover.y = 0;
    }
    cover.fills = [
        {
            type: 'GRADIENT_LINEAR',
            gradientStops: [
                { position: 0, color: Object.assign(Object.assign({}, grad.from), { a: 1 }) },
                { position: 1, color: Object.assign(Object.assign({}, grad.to), { a: 1 }) },
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
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type !== 'generate')
        return;
    const selectedPageIds = msg.selectedPageIds || [figma.currentPage.id];
    const selectedPages = figma.root.children.filter(p => selectedPageIds.includes(p.id));
    if (selectedPages.length === 0) {
        figma.notify('No pages selected.');
        return;
    }
    // Load fonts — try Facebook Sans first, fall back to Inter
    let fontRegular = { family: 'Inter', style: 'Regular' };
    let fontBold = { family: 'Inter', style: 'Bold' };
    try {
        yield figma.loadFontAsync({ family: 'Facebook Sans', style: 'Regular' });
        yield figma.loadFontAsync({ family: 'Facebook Sans', style: 'Bold' });
        fontRegular = { family: 'Facebook Sans', style: 'Regular' };
        fontBold = { family: 'Facebook Sans', style: 'Bold' };
    }
    catch (_a) {
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        yield figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
    }
    const grad = msg.gradient === 'custom'
        ? { from: hexToRgb(msg.customFrom), to: hexToRgb(msg.customTo) }
        : (gradients[msg.gradient] || gradients.blue);
    let firstCover = null;
    const originalPage = figma.currentPage;
    for (const page of selectedPages) {
        const cover = createCoverOnPage(page, msg, fontRegular, fontBold, grad);
        if (!firstCover)
            firstCover = cover;
    }
    // Set file thumbnail from the first selected page's cover
    let thumbnailSet = false;
    if (firstCover) {
        // Switch to the first page so we can set thumbnail and zoom
        figma.currentPage = selectedPages[0];
        figma.currentPage.selection = [firstCover];
        figma.viewport.scrollAndZoomIntoView([firstCover]);
        try {
            yield figma.setFileThumbnailNodeAsync(firstCover);
            thumbnailSet = true;
        }
        catch (e) {
            figma.notify('Warning: Could not set file thumbnail.', { error: true });
        }
    }
    yield figma.saveVersionHistoryAsync('Cover generated');
    const count = selectedPages.length;
    const thumbMsg = thumbnailSet ? '' : ' (thumbnail not set)';
    figma.notify(count === 1
        ? `Cover generated!${thumbMsg}`
        : `Covers generated on ${count} pages!${thumbMsg}`);
});
