export default (data = {}) => {

  /* div - keyword - relateNews collection - result cards(max 10) */
  let article;

  let resultCont = document.createElement("div"); resultCont.classList.add("result-container");

  let resultHead = document.createElement("div"); resultHead.classList.add("result-head");
  resultHead.innerHTML = `Top headlines for topic ~ <span>&nbsp;${data.keyword}</span>`;

  let resultColl = document.createElement("div"); resultColl.classList.add("result-collection");

  if (Object.keys(data).includes("articles")) {
    if (data.articles.length > 10) {
      data.articles.length = 10;
    }

    let resultCardCount = 1;
    for (article of data.articles) {
      resultColl.appendChild(createResultCard(article.url, article.urlToImage, article.title, resultCardCount++));
    }
  }

  resultCont.appendChild(resultHead);
  resultCont.appendChild(resultColl);

  return resultCont;
}

function createResultCard(artURL, imgURL, title, cardCount) {

  /* div - figure - a - img, figcap */

  let resultCard = document.createElement("div"); resultCard.classList.add("result-card", `card${cardCount}`);
  let figEle = document.createElement("figure");
  let linkEle = document.createElement("a"); linkEle.href = artURL; linkEle.target = "_blank";
  let figEleImg = document.createElement("img"); figEleImg.alt = "Card Image"; figEleImg.src = imgURL;
  let figEleCap = document.createElement("figcaption"); figEleCap.innerHTML = title;

  linkEle.appendChild(figEleImg);
  linkEle.appendChild(figEleCap);
  figEle.appendChild(linkEle);
  resultCard.appendChild(figEle);

  return resultCard;
}
