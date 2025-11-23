function navigation(slider) {
  let wrapper, dots, arrowLeft, arrowRight;
  // If this navigation instance belongs to the person slider, we will
  // skip creating the plugin arrows/dots and use custom controls instead.
  const isPerson = slider && slider.container && slider.container.id === "person-keen-slider";

  function markup(remove) {
    wrapperMarkup(remove);
    dotMarkup(remove);
    arrowMarkup(remove);
  }

  function removeElement(elment) {
    // defensive: only remove when element and parent exist
    if (!elment) return;
    if (elment.parentNode) elment.parentNode.removeChild(elment);
  }
  function createDiv(className) {
    var div = document.createElement("div");
    var classNames = className.split(" ");
    classNames.forEach((name) => div.classList.add(name));
    return div;
  }

  function arrowMarkup(remove) {
    if (isPerson) return; 
    if (remove) {
      removeElement(arrowLeft);
      removeElement(arrowRight);
      return;
    }

    arrowLeft = createDiv("arrow arrow--left");
    arrowLeft.innerHTML = "&lt;";
    arrowLeft.addEventListener("click", () => slider.prev());
    arrowRight = createDiv("arrow arrow--right");
    arrowRight.innerHTML = "&gt;";
    arrowRight.addEventListener("click", () => slider.next());

    wrapper.appendChild(arrowLeft);
    wrapper.appendChild(arrowRight);
  }

  function wrapperMarkup(remove) {
    if (remove) {
      var parent = wrapper.parentNode;
      while (wrapper.firstChild)
        parent.insertBefore(wrapper.firstChild, wrapper);
      removeElement(wrapper);
      return;
    }
    wrapper = createDiv("navigation-wrapper");
    slider.container.parentNode.appendChild(wrapper);
    wrapper.appendChild(slider.container);
  }

  function dotMarkup(remove) {
    if (isPerson) return; 
    if (remove) {
      removeElement(dots);
      return;
    }
    dots = createDiv("dots");
    slider.track.details.slides.forEach((_e, idx) => {
      var dot = createDiv("dot");
      dot.addEventListener("click", () => slider.moveToIdx(idx));
      dots.appendChild(dot);
    });
    wrapper.appendChild(dots);
  }

  function updateClasses() {
    var slide = slider.track.details.rel;
    if (!isPerson && arrowLeft && arrowRight) {
      slide === 0
        ? arrowLeft.classList.add("arrow--disabled")
        : arrowLeft.classList.remove("arrow--disabled");
      slide === slider.track.details.slides.length - 1
        ? arrowRight.classList.add("arrow--disabled")
        : arrowRight.classList.remove("arrow--disabled");
    }
    if (dots && dots.children) {
      Array.from(dots.children).forEach(function (dot, idx) {
        idx === slide
          ? dot.classList.add("dot--active")
          : dot.classList.remove("dot--active");
      });
    }
  }

  slider.on("created", () => {
    markup();
    updateClasses();
  });
  slider.on("optionsChanged", () => {
    console.log(2);
    markup(true);
    markup();
    updateClasses();
  });
  slider.on("slideChanged", () => {
    updateClasses();
  });
  slider.on("destroyed", () => {
    markup(true);
  });
}

function AutoPlay(slider) {
  if (!slider) return null;
  setInterval(() => {
    slider.next();
  }, 3000);
}

var slider2 = null;

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the keen slider after DOM is ready to ensure element exists
  try {
    slider2 = new KeenSlider("#person-keen-slider", {}, [navigation]);
  } catch (e) {
    console.warn('KeenSlider initialization failed:', e);
    slider2 = null;
  }

  var prevBtn = document.querySelector('#person-slider-nav .nav-arrow.prev');
  var nextBtn = document.querySelector('#person-slider-nav .nav-arrow.next');
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (slider2) slider2.prev();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (slider2) slider2.next();
    });
  }

});
