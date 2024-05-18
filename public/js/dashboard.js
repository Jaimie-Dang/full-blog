let ui = new firebaseui.auth.AuthUI(auth);

let login = document.querySelector(".login");
// Hiển thị blog cards (xử lý)
const blogSection = document.querySelector(".blogs-section");

auth.onAuthStateChanged((user) => {
  if (user) {
    login.style.display = "none";
    getUserWrittenBlogs();
  } else {
    setupLoginButton();
  }
});

const setupLoginButton = () => {
  ui.start("#loginUI", {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectURL) {
        console.log(authResult);
        return false;
      },
    },
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  });
};

// fetch user written blogs
const getUserWrittenBlogs = () => {
  db.collection("blogs")
    .where("author", "==", auth.currentUser.email.split("@")[0])
    .get()
    .then((blogs) => {
      blogs.forEach((blog) => {
        createBlog(blog);
      });
    })
    .catch((err) => {
      console.log("Error getting blogs");
    });
};

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
      <a href="/${blog.id}/editor" class="btn grey">edit</a>
      <a href="/" onclick="deleteBlog('${
        blog.id
      }')" class="btn danger">delete</a>
    </div>
    `;
};
