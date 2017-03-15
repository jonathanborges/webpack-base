export default class CropThumb {

  constructor(containerWidth, containerHeight) {
    this.container = { width: containerWidth, height: containerHeight };
    this.preview = { width: 0, height: 0, x: 0, y: 0 };
    this.image = { source: null, width: 0, height: 0, type: null };
    this.scale = 0;

    this.onInit();
    this.onUpload();
    this.draggable();
    this.crop();
  }

  onInit() {
    let preview = document.querySelector('.crop-thumb .preview');
    preview.style.width = `${this.container.width}px`;
    preview.style.height = `${this.container.height}px`;
  }

  draggable() {
    var that = this;
    let selected = null;
    let position = { x_pos: 0, x_el: 0, y_pos: 0, y_el: 0 };

    function drag_init(el) {
      console.log('drag_init');
      selected = el;
      position.x_el = position.x_pos - el.offsetLeft;
      position.y_el = position.x_pos - el.offsetTop;
    }

    function move_el(event) {
      if (event.target.nodeName !== "INPUT") {
        let scale = parseFloat(that.scale) / 100;
        position.x_pos = document.all ? window.event.clientX : event.pageX;
        position.y_pos = document.all ? window.event.clientY : event.pageY;
        let offset_x = position.x_pos - position.x_el;
        let offset_y = position.y_pos - position.y_el;
        let diff_x = (that.preview.width * scale) / 2;
        let diff_y = (that.preview.height * scale) / 2;
        if (selected !== null) {
          if (offset_x < diff_x && offset_x > (that.preview.width - that.container.width + diff_x) * -1) {
            that.preview.x = offset_x;
            selected.style.left = `${offset_x}px`;
            console.log('offset_x:'+offset_x);
          }
          if (offset_y < diff_y && offset_y > (that.preview.height - that.container.height + diff_y) * -1) {
            that.preview.y = offset_y;
            selected.style.top = `${offset_y}px`;
            console.log('offset_y:'+offset_y);
          }
        }
        event.preventDefault();
      }
    }

    document.addEventListener('mousedown', event => {
      if (event.target.nodeName == 'CANVAS' && event.target.classList[0] == 'preview-canvas') {
        drag_init(event.target);
        return false;
      }
    });

    document.addEventListener('mousemove', move_el);
    document.addEventListener('mouseup', () => {
      selected = null;
    });
  }

  showPreview(upload) {
    var that = this;
    if (upload.files && upload.files[0]) {
      this.image.type = upload.files[0].type;
      var reader = new FileReader();
      reader.addEventListener('load', event => {
        that.loadPreview(event);
      });
      reader.readAsDataURL(upload.files[0]);
    }
  }

  loadPreview(fileEvent) {
    var that = this;
    let image = new Image();
    image.src = fileEvent.target.result;
    this.image.width = image.width;
    this.image.height = image.height;
    image.addEventListener('load', event => {
      if (that.calculatePreviewSize()) {
        let canvas = document.createElement('canvas');
        canvas.width = that.preview.width;
        canvas.height = that.preview.height;
        canvas.classList.add('preview-canvas');
        let ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, that.image.width, that.image.height, 0, 0, that.preview.width, that.preview.height);
        document.querySelector('.preview').appendChild(canvas);
        this.image.source = canvas;
      }
    });
  }

  calculatePreviewSize() {
    if (this.container.width > this.container.height) {
      if (this.image.width > this.image.height) {
        this.preview.height = this.container.height;
        this.preview.width = this.image.width * this.image.height / this.image.height;
        return true;
      } else {
        this.preview.width = this.container.width;
        this.preview.height = this.image.height * this.container.width / this.image.width;
        return true;
      }
    }
  }

  onUpload() {
    var that = this;
    let upload = document.querySelector('.crop-thumb .upload');
    upload.addEventListener('change', event => {
      that.showPreview(upload);
    });
  }

  crop() {
    var that = this;
    document.querySelector('.crop').addEventListener('click', () => {
      console.log('cropped!');
      var canvas = document.createElement('canvas');
      canvas.width = that.container.width;
      canvas.height = that.container.height;
      var ctx = canvas.getContext('2d');
      //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(that.image.source, -this.preview.x, -this.preview.y, 335, 223, 0, 0, that.container.width, that.container.height);
      document.querySelector('body').appendChild(canvas);
    });
  }

}
exports["default"] = CropThumb;
module.exports = exports["default"];