function previewImage(event) {
  var input = event.target.closest(".image");
  var preview = input.parentElement.querySelector(".preview");
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
    };

    reader.readAsDataURL(input.files[0]);
  }
}
