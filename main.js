"use strict";

//Make navbar transparent when it is on the top
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;

window.addEventListener("scroll", () => {
  // console.log(window.scrollY);
  if (window.scrollY >= navbarHeight) {
    document.body.classList.add("fixed-nav");
  } else {
    document.body.classList.remove("fixed-nav");
  }
});

// Handle scrolling when tapping on the navbar menu

// Ellie's solve (simple)
const navbarMenu = document.querySelector(".navbar__menu");
navbarMenu.addEventListener("click", (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return;
  }
  navbarMenu.classList.remove("show");
  scrollIntoView(link);

  //Active navbar menu item when btn click
  selectNavItem(target);
});

//---------------------------------------------

// //Another solve (sol.1)
// const navbarMenu = document.querySelectorAll(".navbar__menu__item");
// navbarMenu.forEach((item, index) => {
//   console.log(item);
//   item.addEventListener("click", (e) => {
//     const target = e.target;
//     const link = target.dataset.link;
//     console.log(target.dataset.link);
//     const scrollTo = document.querySelector(link);
//     scrollTo.scrollIntoView({ behavior: "smooth" });
//   });
// });

// // Another solve (sol.2 -- switch)
// const menuBtns = document.querySelectorAll(".navbar__menu__item");
// menuBtns.forEach((item, index) => {
//   item.addEventListener("click", (e) => {
//     const target = e.target;
//     console.log(target);
//     const link = target.dataset.link;
//     console.log(link);
//     const scrollTo = document.querySelector(link);
//     switch (index) {
//       case 0:
//         scrollTo.scrollIntoView({ behavior: "smooth" });
//         break;
//       case 1:
//         scrollTo.scrollIntoView({ behavior: "smooth" });
//         break;
//       case 2:
//         scrollTo.scrollIntoView({ behavior: "smooth" });
//         break;
//       case 3:
//         scrollTo.scrollIntoView({ behavior: "smooth" });
//         break;
//       case 4:
//         scrollTo.scrollIntoView({ behavior: "smooth" });
//         break;
//       case 5:
//         scrollTo.scrollIntoView({ behavior: "smooth" });
//         break;
//     }
//   });
// });

//--------------------------------------------

//Handle click on "contact me" button on home
const homeContactBtn = document.querySelector(".home__contact");
homeContactBtn.addEventListener("click", () => {
  scrollIntoView("#contact");
});

//Make home slowly fade to transparent as the window scrolls down
const homeWhole = document.querySelector("#home");
const home = document.querySelector(".home__contents");
const homeHeight = homeWhole.getBoundingClientRect().height;

window.addEventListener("scroll", () => {
  // console.log(1 - window.scrollY / homeHeight);
  home.style.opacity = 1 - window.scrollY / homeHeight;
  homeContactBtn.style.opacity = 1 - window.scrollY / homeHeight;
});

homeContactBtn.addEventListener("mouseenter", () => {
  homeContactBtn.style.opacity = 1;
});

homeContactBtn.addEventListener("mouseleave", () => {
  homeContactBtn.style.opacity = 1 - window.scrollY / homeHeight;
});

//Show "arrow up" button when scrolling down
const arrowUp = document.querySelector(".arrow-up");
const body = document.querySelector("body");
const bodyHeight = body.getBoundingClientRect().height;
const contact = document.querySelector("#contact");
const contactHeight = contact.getBoundingClientRect().height;
window.addEventListener("scroll", () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add("visible");
  } else {
    arrowUp.classList.remove("visible");
  }
});

// Handle click on the "arrow up" button click
arrowUp.addEventListener("click", () => {
  scrollIntoView("#home");
});

//Projects
const workBtnContainer = document.querySelector(".work__categories");
const projectContainer = document.querySelector(".work__projects");
const projects = document.querySelectorAll(".project");
workBtnContainer.addEventListener("click", (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }

  //Remove selection from the previous item and select the new one
  const active = document.querySelector(".category__btn.selected");
  active.classList.remove("selected");
  console.log(active);
  const target =
    e.target.nodeName === "BUTTON" ? e.target : e.target.parentNode;
  target.classList.add("selected");

  projectContainer.classList.add("anim-out");
  setTimeout(() => {
    projectContainer.classList.remove("anim-out");
    projects.forEach((project) => {
      if (filter === "*" || filter === project.dataset.type) {
        project.classList.remove("invisible");
      } else {
        project.classList.add("invisible");
      }
    });
  }, 300);
});

//Create navbar toggleBTn for small screen
const navbarToggleBTn = document.querySelector(".navbar__toggleBtn");

navbarToggleBTn.addEventListener("click", () => {
  navbarMenu.classList.toggle("show");
});

//1.모든 섹션 요소들과 메뉴아이템들을 가지고 온다.
//2.IntersectionObserver를 이용해서 모든 섹션들을 관찰한다.
//3.보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다.

const sectionIds = [
  "#home",
  "#about",
  "#skills",
  "#work",
  "#testimonials",
  "#contact",
];

const sections = sectionIds.map((id) => {
  return document.querySelector(id);
});
const navItems = sectionIds.map((id) => {
  return document.querySelector(`[data-link="${id}"]`);
});
let selectedNavIndex = 0;
let selectedNavItem = navItems[0];
let selectNavItem = (selected) => {
  selectedNavItem.classList.remove("active");
  selectedNavItem = selected;
  selectedNavItem.classList.add("active");
};

let scrollIntoView = (selector) => {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: "smooth" });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
};

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.3,
};

const observerCallback = (entries, observer) => {
  return entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      //스크롤링이 아래로 되어서 페이지가 올라옴
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }
    }
  });
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

window.addEventListener("wheel", () => {
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    window.scrollY + window.innerHeight ===
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);
});
