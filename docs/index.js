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

  console.log("DB opened");
};

// ==================================================
// DBを開けなかった場合
// ==================================================
// onerror
// → 非同期処理が失敗したときに実行される
request.onerror = () => {
  console.error("DB open error:", request.error);
};

// ==================================================
// Create
// ==================================================
// ボタンをクリックしたらデータを追加する
document.querySelector("#create").addEventListener("click", () => {
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
  // id がすでに存在する場合はエラーになる
  const request = store.add({
    id: 1,
    name: "Alice",
  });

  // onsuccess
  // → add() が成功したときに実行される
  request.onsuccess = () => {
    console.log("Created");
  };

  // onerror
  // → add() が失敗したときに実行される
  request.onerror = () => {
    console.error("Create error:", request.error);
  };
});

// ==================================================
// Read
// ==================================================
// ボタンをクリックしたらデータを取得する
document.querySelector("#read").addEventListener("click", () => {
  // transaction()
  // → DBを操作するためのトランザクションを開始する
  //
  // "readonly"
  // → 読み取りだけを許可する
  const transaction = db.transaction(STORE_NAME, "readonly");

  // objectStore()
  // → 操作する Object Store を取得する
  const store = transaction.objectStore(STORE_NAME);

  // get()
  // → 指定したキーのデータを取得する
  //
  // 今回は id が 1 のデータを取得する
  const request = store.get(1);

  // onsuccess
  // → get() が成功したときに実行される
  request.onsuccess = () => {
    console.log("Read:", request.result);
  };

  // onerror
  // → get() が失敗したときに実行される
  request.onerror = () => {
    console.error("Read error:", request.error);
  };
});

// ==================================================
// Update
// ==================================================
// ボタンをクリックしたらデータを更新する
document.querySelector("#update").addEventListener("click", () => {
  // データを変更するので readwrite を指定する
  const transaction = db.transaction(STORE_NAME, "readwrite");

  // 操作する Object Store を取得する
  const store = transaction.objectStore(STORE_NAME);

  // put()
  // → データを追加・更新する
  //
  // 同じ id のデータが存在する場合は更新する
  const request = store.put({
    id: 1,
    name: "Bob",
  });

  // onsuccess
  // → put() が成功したときに実行される
  request.onsuccess = () => {
    console.log("Updated");
  };

  // onerror
  // → put() が失敗したときに実行される
  request.onerror = () => {
    console.error("Update error:", request.error);
  };
});

// ==================================================
// Delete
// ==================================================
// ボタンをクリックしたらデータを削除する
document.querySelector("#delete").addEventListener("click", () => {
  // データを削除するので readwrite を指定する
  const transaction = db.transaction(STORE_NAME, "readwrite");

  // 操作する Object Store を取得する
  const store = transaction.objectStore(STORE_NAME);

  // delete()
  // → 指定したキーのデータを削除する
  //
  // 今回は id が 1 のデータを削除する
  const request = store.delete(1);

  // onsuccess
  // → delete() が成功したときに実行される
  request.onsuccess = () => {
    console.log("Deleted");
  };

  // onerror
  // → delete() が失敗したときに実行される
  request.onerror = () => {
    console.error("Delete error:", request.error);
  };
});
