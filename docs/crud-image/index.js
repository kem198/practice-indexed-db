// IndexedDB のデータベース名
const DB_NAME = "practice";

// データベースのバージョン
// この番号を上げると onupgradeneeded が実行される
const DB_VERSION = 2;

// データを保存する Object Store の名前
const STORE_NAME = "images";

let db;

// 処理結果を表示する要素
const result = document.querySelector("#result");

// 画像を表示する要素
const images = document.querySelector("#images");

// ==================================================
// DBを開く
// ==================================================
// indexedDB.open()
// → 指定した名前・バージョンのデータベースを開く
//
// DB がまだ存在しない場合や、バージョンが変わった場合は
// onupgradeneeded が実行される
const request = indexedDB.open(DB_NAME, DB_VERSION);

// ==================================================
// Object Storeを作成する
// ==================================================
// onupgradeneeded
// → DB の新規作成やバージョンアップ時に実行される
request.onupgradeneeded = (event) => {
  // open() の結果として取得したデータベース
  db = event.target.result;

  // Object Store がまだ存在しない場合
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    // createObjectStore()
    // → データを保存する「入れ物」を作成する
    //
    // keyPath: "id"
    // → 各データの id プロパティをキーとして使用する
    db.createObjectStore(STORE_NAME, {
      keyPath: "id",
      autoIncrement: true, // id をインクリメントする設定
    });
  }
};

// ==================================================
// DBを開けた場合
// ==================================================
// onsuccess
// → 非同期処理が成功したときに実行される
request.onsuccess = (event) => {
  // open() で開いたデータベースを取得する
  db = event.target.result;

  result.textContent = "DB opened";
};

// ==================================================
// DBを開けなかった場合
// ==================================================
// onerror
// → 非同期処理が失敗したときに実行される
request.onerror = () => {
  result.textContent = `DB open error: ${request.error}`;
};

// ==================================================
// Create
// ==================================================
// ボタンをクリックしたら画像を追加する
document.querySelector("#create").addEventListener("click", () => {
  // 入力欄から画像ファイルを取得する
  const file = document.querySelector("#create-image").files[0];

  // 画像が選択されていない場合
  if (!file) {
    result.textContent = "Create error: image is required";
    return;
  }

  // transaction()
  // → DBを操作するための「トランザクション」を開始する
  //
  // "readwrite"
  // → データの追加・更新・削除を許可する
  const transaction = db.transaction(STORE_NAME, "readwrite");

  // objectStore()
  // → 操作する Object Store を取得する
  const store = transaction.objectStore(STORE_NAME);

  // add()
  // → 新しいデータを追加する
  //
  // id は自動でインクリメントされる
  //
  // File は Blob を継承しているため、
  // IndexedDB にそのまま保存できる
  const request = store.add({
    image: file,
  });

  // onsuccess
  // → add() が成功したときに実行される
  request.onsuccess = () => {
    result.textContent = `Created: id=${request.result}`;
  };

  // onerror
  // → add() が失敗したときに実行される
  request.onerror = () => {
    result.textContent = `Create error: ${request.error}`;
  };
});

// ==================================================
// Read
// ==================================================
// ボタンをクリックしたら画像を取得する
document.querySelector("#read").addEventListener("click", () => {
  // 入力欄から id を取得する
  const id = document.querySelector("#read-id").value;

  // 以前表示した画像を削除する
  images.replaceChildren();

  // transaction()
  // → DBを操作するためのトランザクションを開始する
  //
  // "readonly"
  // → 読み取りだけを許可する
  const transaction = db.transaction(STORE_NAME, "readonly");

  // objectStore()
  // → 操作する Object Store を取得する
  const store = transaction.objectStore(STORE_NAME);

  // id が指定されている場合
  if (id !== "") {
    // get()
    // → 指定したキーのデータを取得する
    const request = store.get(Number(id));

    // onsuccess
    // → get() が成功したときに実行される
    request.onsuccess = () => {
      // データが存在しない場合
      if (!request.result) {
        result.textContent = `Not found: id=${id}`;
        return;
      }

      // Blob URL を作成する
      // → File / Blob を <img> で表示できる URL に変換する
      const url = URL.createObjectURL(request.result.image);

      // img 要素を作成する
      const image = document.createElement("img");

      // 画像の URL を設定する
      image.src = url;

      // 画像の ID を表示する
      const idElement = document.createElement("span");
      idElement.textContent = `id=${request.result.id}`;

      // 画像と ID をまとめる要素
      const imageItem = document.createElement("div");
      imageItem.className = "image-item";

      imageItem.append(idElement, image);

      // index.html に画像を追加する
      images.append(imageItem);

      result.textContent = `Read: id=${request.result.id}`;
    };

    // onerror
    // → get() が失敗したときに実行される
    request.onerror = () => {
      result.textContent = `Read error: ${request.error}`;
    };

    return;
  }

  // getAll()
  // → Object Store の全データを取得する
  const request = store.getAll();

  // onsuccess
  // → getAll() が成功したときに実行される
  request.onsuccess = () => {
    // 取得したデータを1件ずつ処理する
    request.result.forEach((item) => {
      // Blob URL を作成する
      // → File / Blob を <img> で表示できる URL に変換する
      const url = URL.createObjectURL(item.image);

      // img 要素を作成する
      const image = document.createElement("img");

      // 画像の URL を設定する
      image.src = url;

      // 画像の ID を表示する
      const idElement = document.createElement("span");
      idElement.textContent = `id=${item.id}`;

      // 画像と ID をまとめる要素
      const imageItem = document.createElement("div");
      imageItem.className = "image-item";

      imageItem.append(idElement, image);

      // index.html に画像を追加する
      images.append(imageItem);
    });

    result.textContent = `Read: ${request.result.length} image(s)`;
  };

  // onerror
  // → getAll() が失敗したときに実行される
  request.onerror = () => {
    result.textContent = `Read error: ${request.error}`;
  };
});

// ==================================================
// Update
// ==================================================
// ボタンをクリックしたら画像を更新する
document.querySelector("#update").addEventListener("click", () => {
  // 入力欄から id を取得する
  const id = document.querySelector("#update-id").value;

  // 入力欄から画像ファイルを取得する
  const file = document.querySelector("#update-image").files[0];

  // id が指定されていない場合
  if (id === "") {
    result.textContent = "Update error: id is required";
    return;
  }

  // 画像が選択されていない場合
  if (!file) {
    result.textContent = "Update error: image is required";
    return;
  }

  // データを変更するので readwrite を指定する
  const transaction = db.transaction(STORE_NAME, "readwrite");

  // 操作する Object Store を取得する
  const store = transaction.objectStore(STORE_NAME);

  // put()
  // → データを追加・更新する
  //
  // 同じ id のデータが存在する場合は更新する
  const request = store.put({
    id: Number(id),
    image: file,
  });

  // onsuccess
  // → put() が成功したときに実行される
  request.onsuccess = () => {
    result.textContent = `Updated: id=${id}`;
  };

  // onerror
  // → put() が失敗したときに実行される
  request.onerror = () => {
    result.textContent = `Update error: ${request.error}`;
  };
});

// ==================================================
// Delete
// ==================================================
// ボタンをクリックしたら画像を削除する
document.querySelector("#delete").addEventListener("click", () => {
  // 入力欄から id を取得する
  const id = document.querySelector("#delete-id").value;

  // データを削除するので readwrite を指定する
  const transaction = db.transaction(STORE_NAME, "readwrite");

  // 操作する Object Store を取得する
  const store = transaction.objectStore(STORE_NAME);

  // id が指定されている場合
  if (id !== "") {
    // delete()
    // → 指定したキーのデータを削除する
    const request = store.delete(Number(id));

    // onsuccess
    // → delete() が成功したときに実行される
    request.onsuccess = () => {
      result.textContent = `Deleted: id=${id}`;
    };

    // onerror
    // → delete() が失敗したときに実行される
    request.onerror = () => {
      result.textContent = `Delete error: ${request.error}`;
    };

    return;
  }

  // clear()
  // → Object Store の全データを削除する
  const request = store.clear();

  // onsuccess
  // → clear() が成功したときに実行される
  request.onsuccess = () => {
    result.textContent = "Deleted: all";
  };

  // onerror
  // → clear() が失敗したときに実行される
  request.onerror = () => {
    result.textContent = `Delete error: ${request.error}`;
  };
});
