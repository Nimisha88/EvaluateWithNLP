import ctaBckDrpImg from "../../image/sci-chalk.jpg";
import logoImg from "../../image/brand-logo.svg";
import bckdrpLogoImg from "../../image/bckdrp-logo.svg";

const icon = document.querySelector(".page-icon");
icon.href = logoImg;

const navLogo = document.getElementById("nav-logo");
navLogo.src = logoImg;

const ctaBckDrp = document.querySelector(".cta-bckdrp-img");
ctaBckDrp.src = ctaBckDrpImg;

const bckdrpLogo = document.querySelector(".bckdrp-logo-big");
bckdrpLogo.src = bckdrpLogoImg;
