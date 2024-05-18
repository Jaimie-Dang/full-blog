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

  // format the article for that create another function
  const article = document.querySelector(".article");
  addArticle(article, data.article);
};

const addArticle = (art, data) => {
  //split the article with enter "\n" and filter it to remove empty array
  data = data.split("\n").filter((item) => item.length);

  // use forEach to loop through the data
  data.forEach((item) => {
    // check for heading
    if (item[0] == "#") {
      let hCount = 0;
      let i = 0;
      while (item[i] == "#") {
        hCount++;
        i++;
      }
      //=> định nghĩa thẻ heading
      let tag = `h${hCount}`;

      // Chèn thẻ tag vào article element
      art.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`;
    }
    //checking for image format
    else if (item[0] == "!" && item[1] == "[") {
      let seperator;

      for (let i = 0; i <= item.length; i++) {
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
      art.innerHTML += `
        <img src="${src}" alt="${alt}" class="article-image">
        `;
    } else {
      // add else where we make a "p" element
      art.innerHTML += `<p>${item}</p>`;
    }
  });
};
