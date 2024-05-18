// Hiển thị blog cards (xử lý)
const blogSection = document.querySelector(".blogs-section");

// type this fetch all blogs from the database
db.collection("blogs")
  .get()
  .then((blogs) => {
    blogs.forEach((blog) => {
      if (blog.id != decodeURI(location.pathname.split("/").pop())) {
        createBlog(blog);
      }
    });
  });

// Truyền 1 object blog vào createBlog
const createBlog = (blog) => {
  // Lấy dữ liệu ra từ blog.data()
  let data = blog.data();
  // Sử dụng DOM ảo đề chèn vào trang web (innerHTML)
  blogSection.innerHTML += `
    <div class="blog-card">
      <img src="${data.bannerImage}" class="blog-image" alt="">
      <h1 class="blog-title">${data.title.substring(0, 100) + "..."}</h1>
      <p class="blog-overview">${data.article.substring(0, 200) + "..."}</p>
      <a href="/${blog.id}" class="btn dark">read</a>
    </div>
    `;
};
