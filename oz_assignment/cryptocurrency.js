const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";
const FAVORITES_KEY = "cryptoFavorites";
const REFRESH_INTERVAL_MS = 1000;

const cryptoList = document.querySelector("#cryptoList");
const searchInput = document.querySelector("#searchInput");
const loading = document.querySelector("#loading");
const cryptoTable = document.querySelector("#cryptoTable");
const emptyMessage = document.querySelector("#emptyMessage");
const updateStatus = document.querySelector("#updateStatus");
const allTab = document.querySelector("#allTab");
const favoritesTab = document.querySelector("#favoritesTab");

let allCryptoData = [];
let favorites = loadFavorites();
let currentTab = "all";

function loadFavorites() {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);

    if (!savedFavorites) {
        return [];
    }

    try {
        return JSON.parse(savedFavorites);
    } catch (error) {
        console.warn("관심항목을 불러오지 못했습니다.", error);
        return [];
    }
}

function saveFavorites() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function formatPrice(price) {
    const number = Number(price);

    if (Number.isNaN(number)) {
        return "-";
    }

    return number.toLocaleString("ko-KR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: number < 1 ? 8 : 4,
    });
}

function updateStatusText(message) {
    updateStatus.textContent = message;
}

async function fetchCryptoData() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("데이터를 불러오는데 실패했습니다.");
        }

        const data = await response.json();

        allCryptoData = data
            .filter((item) => item.symbol.endsWith("USDT") && Number(item.lastPrice) !== 0)
            .sort((a, b) => a.symbol.localeCompare(b.symbol));

        filterAndRender();
        loading.classList.add("hidden");
        cryptoTable.classList.remove("hidden");
        updateStatusText(`마지막 업데이트: ${new Date().toLocaleTimeString("ko-KR")}`);
    } catch (error) {
        console.error("Error:", error);
        loading.classList.remove("hidden");
        loading.textContent = "데이터를 불러오는 중 오류가 발생했습니다.";
        updateStatusText("네트워크 상태 또는 API 응답을 확인해주세요.");
    }
}

function getFilteredData() {
    const searchTerm = searchInput.value.trim().toUpperCase();

    let filteredData = allCryptoData.filter((item) => item.symbol.includes(searchTerm));

    if (currentTab === "favorites") {
        filteredData = filteredData.filter((item) => favorites.includes(item.symbol));
    }

    return filteredData;
}

function filterAndRender() {
    const filteredData = getFilteredData();
    renderData(filteredData);

    emptyMessage.classList.toggle("hidden", filteredData.length > 0 || allCryptoData.length === 0);
    cryptoTable.classList.toggle("hidden", filteredData.length === 0);
}

function createCell(text, className) {
    const cell = document.createElement("td");
    cell.textContent = text;

    if (className) {
        cell.classList.add(className);
    }

    return cell;
}

function createFavoriteCell(symbol) {
    const cell = document.createElement("td");
    const button = document.createElement("button");
    const isFavorite = favorites.includes(symbol);

    button.type = "button";
    button.className = `fav-btn${isFavorite ? " active" : ""}`;
    button.dataset.symbol = symbol;
    button.textContent = isFavorite ? "★" : "☆";
    button.setAttribute("aria-label", `${symbol} 관심항목 ${isFavorite ? "제거" : "추가"}`);

    cell.appendChild(button);
    return cell;
}

function renderData(data) {
    cryptoList.innerHTML = "";

    data.forEach((item) => {
        const row = document.createElement("tr");
        const priceChange = Number(item.priceChangePercent);
        const changeClass = priceChange >= 0 ? "up" : "down";
        const sign = priceChange >= 0 ? "+" : "";

        row.appendChild(createFavoriteCell(item.symbol));
        row.appendChild(createCell(item.symbol, "symbol"));
        row.appendChild(createCell(formatPrice(item.lastPrice)));
        row.appendChild(createCell(`${sign}${priceChange.toFixed(2)}%`, changeClass));
        row.appendChild(createCell(formatPrice(item.highPrice)));
        row.appendChild(createCell(formatPrice(item.lowPrice)));

        cryptoList.appendChild(row);
    });
}

function toggleFavorite(symbol) {
    if (favorites.includes(symbol)) {
        favorites = favorites.filter((favorite) => favorite !== symbol);
    } else {
        favorites.push(symbol);
    }

    saveFavorites();
    filterAndRender();
}

function setActiveTab(tabName) {
    currentTab = tabName;

    allTab.classList.toggle("active", currentTab === "all");
    favoritesTab.classList.toggle("active", currentTab === "favorites");

    filterAndRender();
}

cryptoList.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest(".fav-btn");

    if (!favoriteButton) {
        return;
    }

    toggleFavorite(favoriteButton.dataset.symbol);
});

searchInput.addEventListener("input", filterAndRender);

allTab.addEventListener("click", () => {
    setActiveTab("all");
});

favoritesTab.addEventListener("click", () => {
    setActiveTab("favorites");
});

fetchCryptoData();
setInterval(fetchCryptoData, REFRESH_INTERVAL_MS);
