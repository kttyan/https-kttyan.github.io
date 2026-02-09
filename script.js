// script.js

// データを保持しておくための箱
let starRailCharacters = [];

/**
 * 外部のデータ置き場(GitHub)からキャラクター情報を取得する関数
 * ページ読み込み時に自動で実行されます
 */
async function fetchCharacterData() {
  try {
    // 1. StarRailRes (有志プロジェクト) からキャラクターの基本データを取得
    const response = await fetch('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/jp/characters.json');
    
    if (!response.ok) throw new Error("データの取得に失敗しました");

    const data = await response.json();

    // 2. データは { "1001": {...}, "1002": {...} } というオブジェクト形式なので、
    // 扱いやすい配列 [ {...}, {...} ] の形に変換します
    starRailCharacters = Object.values(data);

    console.log(`データ取得完了: ${starRailCharacters.length}件`);

    // 3. データ取得完了後、すぐに最初の1人を表示
    drawStarRailCharacter();

  } catch (error) {
    console.error("エラーが発生しました:", error);
    document.getElementById("hsr-char-name").textContent = "読み込み失敗";
  }
}

/**
 * ランダムにキャラクターを選んで画面に表示する関数
 * ボタンクリック時にも呼ばれます
 */
function drawStarRailCharacter() {
  // データがまだ届いていなければ何もしない
  if (starRailCharacters.length === 0) return;

  const imgElement = document.getElementById("hsr-char-img");
  const nameElement = document.getElementById("hsr-char-name");

  // ランダム選出
  const randomIndex = Math.floor(Math.random() * starRailCharacters.length);
  const character = starRailCharacters[randomIndex];

  // 画像URL（立ち絵：Portrait）を生成
  // icon/character ならアイコン、image/character_portrait なら立ち絵になります
  const imageUrl = `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/image/character_portrait/${character.id}.png`;

  // 名前の修正処理
  // データ内の "{NICKNAME}" を "開拓者" に置き換える
  let displayName = character.name.replace("{NICKNAME}", "開拓者");
  // 属性（物理/炎など）がある場合はカッコ書きなどで調整しても良いですが、
  // 今回はシンプルに名前だけ表示します

  // --- 表示の切り替え演出 ---

  // 1. まず透明にする（フェードアウト）
  imgElement.style.opacity = 0;
  nameElement.style.opacity = 0;

  // 2. 少し待ってから画像と名前を入れ替える
  setTimeout(() => {
    imgElement.src = imageUrl;
    nameElement.textContent = displayName;

    // 3. 画像の読み込みが完了したらフェードインさせる
    imgElement.onload = () => {
      imgElement.style.opacity = 1;
      nameElement.style.opacity = 1;
    };
    
    // 万が一画像の読み込みに失敗した場合（画像がないキャラなど）の処理
    imgElement.onerror = () => {
        nameElement.textContent = displayName + " (画像なし)";
        imgElement.style.opacity = 1;
        nameElement.style.opacity = 1;
    }
  }, 300); // 0.3秒待機
}

// ページ読み込み完了時にデータ取得を開始
window.addEventListener("DOMContentLoaded", fetchCharacterData);