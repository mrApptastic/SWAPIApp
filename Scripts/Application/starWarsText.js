var starWarsText = angular.module("starWarsText", ["mrMr"]);

/*
https://css-tricks.com/snippets/css/star-wars-crawl-text/
*/

starWarsText.directive('starWarsText', function () {
    return {
        restrict: 'E',
        template: 
`
<style>
@-webkit-keyframes crawl {
  0% {
    top: 0;
    transform: rotateX(20deg)  translateZ(0);
  }
  100% { 
    top: -6000px;
    transform: rotateX(25deg) translateZ(-2500px);
  }
}

@keyframes crawl {
  0% {
    top: 0;
    transform: rotateX(20deg)  translateZ(0);
  }
  100% { 
    top: -6000px;
    transform: rotateX(25deg) translateZ(-2500px);
  }
}
</style>
<div class="fade"></div>

<section style="
display: flex;
justify-content: center;
position: relative;
height: 400px;
color: #feda4a;
font-family: 'Pathway Gothic One', sans-serif;
font-size: 500%;
font-weight: 600;
letter-spacing: 6px;
line-height: 150%;
perspective: 200px;
text-align: justify;
">

  <div style="
  position: relative;
  top: 9999px;
  transform-origin: 50% 100%;
  animation: crawl 60s linear;
  ">

    <div style="
    font-size: 90%;
    text-align: center;
    ">
      <p ng-bind="title"></p>
      <h2 style="
      margin: 0 0 100px;
      text-transform: uppercase;
      ">{{subTitle}}
      </h2>
    </div>
    
    <span ng-bind-html="lines | mrHtml">

  </div>

</section>
`,
        scope: {
            title: "@",
            subTitle: "@",
            lines: "@"

        }
    };
});