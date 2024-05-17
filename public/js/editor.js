const blogTitleField = document.querySelector(".title");
const articleField = document.querySelector(".article");

// banner
const bannerImage = document.querySelector("#banner-upload"); // input
const banner = document.querySelector(".banner");
let bannerPath;

// button
const publicBtn = document.querySelector(".publish-btn");
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
