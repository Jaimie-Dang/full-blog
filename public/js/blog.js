// truy cập blog ID từ URL
let blogId = decodeURI(location.pathname.split("/").pop());

// fetch document (của 1 document) từ firestore
let docRef = db.collection("blogs").doc(blogId);

// Kiểm tra xem document có tồn tại hay không
docRef.get().then((doc) => {
  if (doc.exists) {
    setupBlog(doc.data());
    console.log(doc.data());
  } else {
    location.replace("/");
  }
});

const setupBlog = (data) => {
  const banner = document.querySelector(".banner");
  const blogTitle = document.querySelector(".title");
  // Tên trang page
  const titleTag = document.querySelector("title");
  const publish = document.querySelector(".published");

  banner.style.backgroundImage = `url(${data.bannerImage})`;

  // Đặt title cho page
  titleTag.innerHTML += blogTitle.innerHTML = data.title;

  publish.innerHTML += data.publishedAt;

  publish.innerHTML += ` -- ${data.author}`;

  // check author
  try {
    if (data.author == auth.currentUser.email.split("@")[0]) {
      let editBtn = document.getElementById("edit-blog-btn");
      editBtn.style.display = "inline";
      editBtn.href = `${blogId}/editor`;
    }
  } catch (error) {
    // do nothing here
  }

  // format the article for that create another function
  const article = document.querySelector(".article");
  addArticle(article, data.article);
};

// Tính toán logic lấy dữ liệu + hình ảnh (bóc tách file/src)
const addArticle = (art, data) => {
  //tách một mảnh thành các dòng bằng ký tự xuống dòng \n + Các dòng trống được loại ra khỏi mảng
  data = data.split("\n").filter((item) => item.length);

  // Sử dụng forEach để lặp qua dữ liệu
  data.forEach((item) => {
    // Nếu dòng bắt đầu bằng ký tự #, nó được coi là tiêu đề
    if (item[0] == "#") {
      // Số lượng tiêu đề liên tiếp xác định cấp độ tiêu đề <h1>, <h2>
      let hCount = 0;
      let i = 0;
      while (item[i] == "#") {
        hCount++;
        i++;
      }
      //=> Thẻ tiêu đề HTML phù hợp được tạo động dựa trên cấp độ tiêu đề
      let tag = `h${hCount}`;

      // Nội dung của tiêu đề (loại bỏ ký tự #) được trích xuất và chèn vào phần tử bài viết
      art.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`;
    }
    //Nếu dòng bắt đầu bằng ![, nó được coi là hình ảnh
    else if (item[0] == "!" && item[1] == "[") {
      let seperator;

      for (let i = 0; i <= item.length; i++) {
        // Mã kiểm tra dấu ] đóng và dấu ( mở để trích xuất văn bản thay thế và URL nguồn của hình ảnh.
        if (
          item[i] == "]" &&
          item[i + 1] == "(" &&
          item[item.length - 1] == ")"
        ) {
          seperator = i;
        }
      }

      let alt = item.slice(2, seperator);
      let src = item.slice(seperator + 2, item.length - 1);
      // Văn bản thay thế và URL nguồn được sử dụng để tạo phần tử <img> trong bài viết
      art.innerHTML += `
        <img src="${src}" alt="${alt}" class="article-image">
        `;
    } else {
      // Nếu dòng không phù hợp với định dạng tiêu đề hoặc hình ảnh, tạo một phần tử <p> (đoạn văn) với nội dung của dòng đó
      art.innerHTML += `<p>${item}</p>`;
    }
  });
};
