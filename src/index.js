export default class CropThumb {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.imageOriginalWidth = null;
    this.imageOriginalHeight = null;
    this.previewWidth = null;
    this.previewHeight = null;
    this.imageY = 0;
    this.imageX = 0;
    this.scale = 0;
    this.image = null;
    this.draggablePreview();
    this.onChangeRange();
    this.onUpload();
    this.crop();
  }

  draggablePreview() {
    var that = this;
    var selected = null,
    x_pos = 0, y_pos = 0,
    x_elem = 0, y_elem = 0;

    function _drag_init(elem) {
      selected = elem;
      x_elem = x_pos - selected.offsetLeft;
      y_elem = y_pos - selected.offsetTop;
    }

    function _move_elem(e) {
      let scale = parseFloat(that.scale) / 100;
      x_pos = document.all ? window.event.clientX : e.pageX;
      y_pos = document.all ? window.event.clientY : e.pageY;
      let position_y = y_pos - y_elem;
      let position_x = x_pos - x_elem;
      let difference_x = scale !== 0 ? (that.previewWidth * scale) / 2 : 0;
      let difference_y = scale !== 0 ? (that.previewHeight * scale) / 2 : 0;
      if (selected !== null) {
        if (position_x < difference_x && position_x > (that.previewWidth - that.width + difference_y) * -1) {
          selected.style.left = position_x + 'px';
          that.imageX = position_x;
        }
        if (position_y < difference_y && position_y > (that.previewHeight - that.height + difference_y) * -1) {
          selected.style.top = position_y + 'px';
          that.imageY = position_y;
        }
      }
      // e.preventDefault();
    }

    function _destroy() {
      selected = null;
    }

    document.querySelector('.preview').addEventListener('mousedown', (e) => {
      _drag_init(e.target);
      return false;
    });

    document.onmousemove = _move_elem;
    document.onmouseup = _destroy;
  }

  onChangeRange() {
    let range = document.querySelector('.zoom');
    let preview = document.querySelector('.preview');
    range.defaultValue = 0;
    range.setAttribute('max', 99);
    range.addEventListener('input', (input) => {
      let rangeValue = input.target.value;
      this.scale = (rangeValue < 10) ? '0'+rangeValue : rangeValue;
      preview.style.transform = `scale(1.${this.scale})`;
    }, false);
  }

  showPreview() {
    var that = this;
    let input = document.querySelector('.upload');
    let preview = document.querySelector('.preview');
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        let image = new Image();
        image.src = e.target.result;
        image.addEventListener('load', () => {
          that.imageOriginalWidth = image.width;
          that.imageOriginalHeight = image.height;
          document.querySelector('.preview').style.background = `url(${e.target.result})`;
          if (that.resize(image)) {
            preview.style.height = that.previewHeight+'px';
            preview.style.width = that.previewWidth+'px';
            that.image = image;
          }
        });
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  resize(image) {
    if (this.width > this.height) {
      if (image.width > image.height) {
        this.previewHeight = this.height;
        this.previewWidth = image.width * this.height / image.height;
        return true;
      } else {
        this.previewWidth = this.width;
        this.previewHeight = image.height * this.width / image.width;
        return true;
      }
    }
  }

  onUpload() {
    let uploadButton = document.querySelector('.upload');
    uploadButton.addEventListener('change', () => {
      this.showPreview();
    });
  }

  crop() {
    var that = this;
    document.querySelector('.action').addEventListener('click', () => {
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;

      var ctx = canvas.getContext("2d");
      //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(that.image, 0, 400, (this.imageOriginalWidth - this.), this.imageOriginalHeight, 0, 0, this.width, this.height);
      var dataURL = canvas.toDataURL("image/png");
      
      var test = new Image();
      test.src = dataURL;
      document.querySelector('body').appendChild(test);
    });
  }
}
exports["default"] = CropThumb;
module.exports = exports["default"];