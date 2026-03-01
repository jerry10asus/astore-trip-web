// Hero 背景自動輪播
const heroBg = document.getElementById('hero-bg');
const images = [
  'assets/banner/R706.jpeg',
  'assets/banner/R733.jpeg',
  'assets/banner/R633.jpeg',
  'assets/banner/R697.jpeg'
];
let current = 0;

function showNextImage() {
  // 淡出當前圖片
  heroBg.style.opacity = '0';
  
  setTimeout(() => {
    // 切換圖片
    current = (current + 1) % images.length;
    heroBg.style.backgroundImage = `url(${images[current]})`;
    
    // 淡入新圖片（50% 透明度）
    setTimeout(() => {
      heroBg.style.opacity = '0.5';
    }, 50);
    
    // 停留 15 秒後切換下一張
    setTimeout(() => {
      showNextImage();
    }, 15000);
  }, 300); // 等待淡出完成
}

// 初始化第一張圖片
heroBg.style.backgroundImage = `url(${images[0]})`;
setTimeout(() => {
  heroBg.style.opacity = '0.5';
}, 50);

// 15.3 秒後開始輪播（淡入 0.3秒 + 停留 15秒）
setTimeout(() => {
  showNextImage();
}, 15300);

// Header Bar 顯示邏輯
const headerBar = document.getElementById('header-bar');
const heroCtaBtn = document.getElementById('hero-cta-btn');

function checkHeaderVisibility() {
  const heroCtaRect = heroCtaBtn.getBoundingClientRect();
  // 當按鈕的底部超出視窗頂部時（按鈕被遮住），顯示 header
  const isButtonHidden = heroCtaRect.bottom < 0;
  
  if (isButtonHidden) {
    headerBar.classList.add('visible');
  } else {
    headerBar.classList.remove('visible');
  }
}

// 監聽滾動事件
window.addEventListener('scroll', checkHeaderVisibility);
// 初始檢查
checkHeaderVisibility();

// 檢測是否為桌面瀏覽器
function isDesktopBrowser() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return !mobileRegex.test(userAgent.toLowerCase());
}

// 彈窗控制
const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close-btn');

function showModal() {
  modalOverlay.classList.add('show');
}

function hideModal() {
  modalOverlay.classList.remove('show');
}

modalCloseBtn.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    hideModal();
  }
});

// 處理「立即使用」按鈕點擊
const appUrl = 'https://app.astoretrip.com/';
const ctaButtons = document.querySelectorAll('.cta-button');

ctaButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (isDesktopBrowser()) {
      // 桌面瀏覽器：顯示彈窗
      showModal();
    } else {
      // 手機瀏覽器：在新分頁開啟連結
      window.open(appUrl, '_blank');
    }
  });
});

// 功能卡片圖片切換
const featureCards = document.querySelectorAll('.feature[data-feature]');
const uiImages = document.querySelectorAll('.ui-image');
const featureList = document.querySelector('.feature-list');

// 切換圖片和卡片狀態的函數
function switchToFeature(featureId) {
  // 移除所有 active class（圖片、卡片和指示器）
  uiImages.forEach(img => {
    img.classList.remove('active');
  });
  featureCards.forEach(c => {
    c.classList.remove('active');
  });
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach(ind => {
    ind.classList.remove('active');
  });
  
  // 顯示對應的圖片、選中卡片和指示器
  const targetImage = document.querySelector(`.ui-image[data-image="${featureId}"]`);
  const targetCard = document.querySelector(`.feature[data-feature="${featureId}"]`);
  const targetIndicator = document.querySelector(`.indicator[data-indicator="${featureId}"]`);
  
  if (targetImage) {
    targetImage.classList.add('active');
  }
  if (targetCard) {
    targetCard.classList.add('active');
  }
  if (targetIndicator) {
    targetIndicator.classList.add('active');
  }
}

// 初始化：第一個卡片為選中狀態
if (featureCards.length > 0) {
  const firstFeatureId = featureCards[0].getAttribute('data-feature');
  switchToFeature(firstFeatureId);
}

// 點擊事件（桌面版和手機版都適用）
featureCards.forEach(card => {
  card.addEventListener('click', () => {
    const featureId = card.getAttribute('data-feature');
    switchToFeature(featureId);
    
    // 手機版：點擊後滾動到該卡片
    if (window.innerWidth <= 768) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
});

// 手機版：監聽滾動事件，自動切換圖片
function handleScroll() {
  if (window.innerWidth > 768) return; // 只在手機版執行
  
  const containerRect = featureList.getBoundingClientRect();
  const containerCenter = containerRect.left + containerRect.width / 2;
  
  let closestCard = null;
  let closestDistance = Infinity;
  
  featureCards.forEach(card => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const distance = Math.abs(cardCenter - containerCenter);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = card;
    }
  });
  
  if (closestCard) {
    const featureId = closestCard.getAttribute('data-feature');
    const currentActive = document.querySelector('.feature.active');
    
    // 只有當選中的卡片改變時才切換
    if (!currentActive || currentActive.getAttribute('data-feature') !== featureId) {
      switchToFeature(featureId);
    }
  }
}

// 監聽滾動事件（使用節流優化性能）
let scrollTimeout;
featureList.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(handleScroll, 100);
});

// 監聽視窗大小變化
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    handleScroll();
  }
});
