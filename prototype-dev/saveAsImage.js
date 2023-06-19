export const initSaveAsImage = (_id, _renderer) => {
    document.getElementById(_id).addEventListener("click", () => {
        // saveAsImage();
        let link = document.createElement("a");
        link.download = "image.png";

        _renderer.domElement.toBlob(function (blob) {
            link.href = URL.createObjectURL(blob);
            link.click();
        }, "image/png");
    });

    //   function saveAsImage() {
    //     let link = document.createElement("a");
    //     link.download = "image.png";

    //     renderer.domElement.toBlob(function (blob) {
    //       link.href = URL.createObjectURL(blob);
    //       link.click();
    //     }, "image/png");
    //   }
}

