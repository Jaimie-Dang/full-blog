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
  // generating id
  let letters = "aabcfrgiwr";
  let blogTitle = blogTitleField.value.split(" ").join("-");
  let id = "";
  for (let i = 0; i < 4; i++) {
    // Math.floor: dùng để làm tròn số thập phân
    id += letters[Math.floor(Math.random() * letters.length)];
  }

  // Setting up docName: cần phải có trong database
  let docName = `${blogTitle}-${id}`;
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
    })
    .then(() => {
      // redirect người dùng tới trang blog vừa tạo
      location.href = `${docName}`;
    })
    .catch((err) => {
      console.error(err);
    });
});
