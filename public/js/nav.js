let ul = document.querySelector(".links-container");

auth.onAuthStateChanged((user) => {
  if (user) {
    // user is login
    ul.innerHTML += `
        <li class="link-item"><a href="/admin" class="link">dashboard</a></li>
        <li class="link-item"><a href="#" onclick="logoutUser()" class="link">logout</a></li>
        `;
  } else {
    // no one is logged in
    ul.innerHTML += `<li class="link-item"><a href="/admin" class="link">login</a></li>`;
  }
});
