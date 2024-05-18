const blogTitleField = document.querySelector(".title");
const articleField = document.querySelector(".article");

// banner
const bannerImage = document.querySelector("#banner-upload"); // input
const banner = document.querySelector(".banner");
let bannerPath;

// button
const publishBtn = document.querySelector(".publish-btn");
const uploadInput = document.querySelector("#image-upload"); // input

// Tạo sự kiện
bannerImage.addEventListener("change", () => {
  uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener("change", () => {
  uploadImage(uploadInput, "image");
});

const uploadImage = (uploadFile, uploadType) => {
  // truy cập vào "file" từ uploadFile.files
  const [file] = uploadFile.files;
  // Thêm điều kiện để đảm bảo chỉ được phép upload image
  if (file && file.type.includes("image")) {
    // Tạo formdata trước khi gửi yêu cầu
    const formdata = new FormData();
    // kết nối file với formdata
    formdata.append("image", file);

    // Tạo phương thức yêu cầu post  đến đường '/upload' sử dụng fetch()
    fetch("/upload", {
      method: "post",
      body: formdata, // đặt background cho banner
    })
      .then((res) => res.json())
      .then((data) => {
        if (uploadType == "image") {
          addImage(data, file.name);
        } else {
          bannerPath = `${location.origin}/${data}`;
          banner.style.backgroundImage = `url("${bannerPath}")`;
        }
      });
  } else {
    // thêm alert cho image upload
    alert("upload image only");
  }
};

const addImage = (imagepath, alt) => {
  // Lấy vị trí con chuột đang ở trong article để chèn ảnh
  let curPos = articleField.selectionStart;
  // định dạng ảnh
  let textToInsert = `\r![${alt}](${imagepath})\r`;
  articleField.value =
    articleField.value.slice(0, curPos) +
    textToInsert +
    articleField.value.slice(curPos);
};

// Tạo mảng months
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

publishBtn.addEventListener("click", () => {
  if (articleField.value.length && blogTitleField.value.length) {
    let docName;
    if (blogID[0] == "editor") {
      // generating id
      let letters = "aabcfrgiwr";
      let blogTitle = blogTitleField.value.split(" ").join("-");
      let id = "";
      for (let i = 0; i < 4; i++) {
        // Math.floor: dùng để làm tròn số thập phân
        id += letters[Math.floor(Math.random() * letters.length)];
      }
      // Setting up docName: cần phải có trong database
      docName = `${blogTitle}-${id}`;
    } else {
      docName = decodeURI(blogID[0]);
    }

    let date = new Date(); // for published at info

    // truy cập firebase với biến db
    db.collection("blogs")
      .doc(docName)
      .set({
        // tạo 1 document mới trong firestore
        title: blogTitleField.value,
        article: articleField.value,
        bannerImage: bannerPath,
        publishedAt: `${date.getDate()} ${
          months[date.getMonth()]
        } ${date.getFullYear()}`,
        author: auth.currentUser.email.split("@")[0], // this will return ["example", "gmail.com"]
      })
      .then(() => {
        // redirect người dùng tới trang blog vừa tạo
        location.href = `/${docName}`; // Đây là đường dẫn tuyệt đối
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

// checking for user logged in or not
auth.onAuthStateChanged((user) => {
  if (!user) {
    location.replace("/admin"); // this will re-direct to admin route if no one is logged in
  }
});

// Checking for existing blog edits
let blogID = location.pathname.split("/");
blogID.shift(); // it will remove first elements which is empty from the array

if (blogID[0] != "editor") {
  // means we are in existing blog edit route
  let docRef = db.collection("blogs").doc(decodeURI(blogID[0]));
  docRef.get().then((doc) => {
    if (doc.exists) {
      let data = doc.data();
      bannerPath = data.bannerImage;
      banner.style.backgroundImage = `url(${bannerPath})`;
      blogTitleField.value = data.title;
      articleField.value = data.article;
    } else {
      location.replace("/"); //home route
    }
  });
}
