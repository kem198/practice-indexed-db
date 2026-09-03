// ==================================================
// 概要
// ==================================================

//  ---------------------------------------------------------------------------------------------------
// | メソッド                  | 意味                        | PostgreSQL での例                        |
// | ------------------------- | --------------------------- | ---------------------------------------- |
// | `indexedDB.open()`        | データベースを開く          | OPEN / CONNECT                           |
// | `createObjectStore()`     | データを保存する場所を作る  | CREATE TABLE                             |
// | `transaction()`           | DB操作を開始する            | BEGIN                                    |
// | `objectStore()`           | 操作する保存場所を取得する  | SELECT * FROM ... / INSERT INTO ... など |
// | `add()`                   | 新規追加                    | INSERT                                   |
// | `get()`                   | 取得                        | SELECT                                   |
// | `put()`                   | 追加・更新                  | INSERT / UPDATE                          |
// | `delete()`                | 削除                        | DELETE                                   |
//  ---------------------------------------------------------------------------------------------------

// IndexedDB のデータベース名
const DB_NAME = "practice";

// データベースのバージョン
// この番号を上げると onupgradeneeded が実行される
const DB_VERSION = 1;

// データを保存する Object Store の名前
const STORE_NAME = "items";

let db;

// 処理結果を表示する要素
const result = document.querySelector("#result");

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

  // createObjectStore()
  // → データを保存する「入れ物」を作成する
  //
  // keyPath: "id"
  // → 各データの id プロパティをキーとして使用する
  db.createObjectStore(STORE_NAME, {
    keyPath: "id",
    autoIncrement: true, // id をインクリメントする設定
  });
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
// ボタンをクリックしたらデータを追加する
document.querySelector("#create").addEventListener("click", () => {
  // 入力欄から name を取得する
  const name = document.querySelector("#create-name").value;

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
  const request = store.add({
    name: name,
  });

  // onsuccess
  // → add() が成功したときに実行される
  request.onsuccess = () => {
    result.textContent = `Created: id=${request.result}, name=${name}`;
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
// ボタンをクリックしたらデータを取得する
document.querySelector("#read").addEventListener("click", () => {
  // 入力欄から id を取得する
  const id = document.querySelector("#read-id").value;

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
      result.textContent = JSON.stringify(request.result, null, 2);
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
    result.textContent = JSON.stringify(request.result, null, 2);
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
// ボタンをクリックしたらデータを更新する
document.querySelector("#update").addEventListener("click", () => {
  // 入力欄から id を取得する
  const id = document.querySelector("#update-id").value;

  // 入力欄から name を取得する
  const name = document.querySelector("#update-name").value;

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
    name: name,
  });

  // onsuccess
  // → put() が成功したときに実行される
  request.onsuccess = () => {
    result.textContent = `Updated: id=${id}, name=${name}`;
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
// ボタンをクリックしたらデータを削除する
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
