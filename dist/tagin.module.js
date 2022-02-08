var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __publicField = (obj, key, value2) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value2);
  return value2;
};
/*!
* Tagin v2.0.2 (https://tagin.netlify.app/)
* Copyright 2020-2022 Erwin Heldy G
* Licensed under MIT (https://github.com/erwinheldy/tagin/blob/master/LICENSE)
*/
var tagin = "";
class Tagin {
  constructor(inputElement, options) {
    __publicField(this, "classElement", "tagin");
    __publicField(this, "classWrapper", "tagin-wrapper");
    __publicField(this, "classTag", "tagin-tag");
    __publicField(this, "classRemove", "tagin-tag-remove");
    __publicField(this, "classInput", "tagin-input");
    __publicField(this, "classInputHidden", "tagin-input-hidden");
    __publicField(this, "target");
    __publicField(this, "wrapper");
    __publicField(this, "input");
    __publicField(this, "separator");
    __publicField(this, "placeholder");
    __publicField(this, "duplicate");
    __publicField(this, "transform");
    __publicField(this, "enter");
    this.target = inputElement;
    this.separator = (options == null ? void 0 : options.separator) || inputElement.dataset.taginSeparator || ",";
    this.placeholder = (options == null ? void 0 : options.placeholder) || inputElement.dataset.taginPlaceholder || "";
    this.duplicate = (options == null ? void 0 : options.duplicate) || inputElement.dataset.taginDuplicate !== void 0;
    this.transform = (options == null ? void 0 : options.transform) || inputElement.dataset.taginTransform || "input => input";
    this.enter = (options == null ? void 0 : options.enter) || inputElement.dataset.taginEnter !== void 0;
    this.createWrapper();
    this.autowidth();
    this.addEventListener();
  }
  createWrapper() {
    const tags = this.getValue() === "" ? "" : this.getValues().map((val) => this.createTag(val)).join("");
    const input2 = document.createElement("input");
    input2.type = "text";
    input2.className = this.classInput;
    input2.placeholder = this.placeholder;
    const wrapper = document.createElement("div");
    wrapper.className = `${this.classWrapper} ${this.target.className}`;
    wrapper.classList.remove(this.classElement);
    wrapper.insertAdjacentHTML("afterbegin", tags);
    wrapper.insertAdjacentElement("beforeend", input2);
    this.target.insertAdjacentElement("afterend", wrapper);
    this.wrapper = wrapper;
    this.input = input2;
  }
  createTag(value2) {
    const onclick = `this.closest('div').dispatchEvent(new CustomEvent('tagin:remove', { detail: this }))`;
    return `<span class="${this.classTag}">${value2}<span onclick="${onclick}" class="${this.classRemove}"></span></span>`;
  }
  getValue() {
    return this.target.value.trim();
  }
  getValues() {
    return this.getValue().split(this.separator);
  }
  getTags() {
    return Array.from(this.wrapper.getElementsByClassName(this.classTag)).map((tag) => tag.textContent);
  }
  getTag() {
    return this.getTags().join(this.separator);
  }
  updateValue() {
    this.target.value = this.getTag();
    this.target.dispatchEvent(new Event("change"));
  }
  autowidth() {
    const fakeEl = document.createElement("div");
    fakeEl.classList.add(this.classInput, this.classInputHidden);
    const string = this.input.value || this.input.placeholder || "";
    fakeEl.innerHTML = string.replace(/ /g, "&nbsp;");
    document.body.appendChild(fakeEl);
    this.input.style.setProperty("width", Math.ceil(parseInt(window.getComputedStyle(fakeEl).width.replace("px", ""))) + 1 + "px");
    fakeEl.remove();
  }
  addEventListener() {
    const wrapper = this.wrapper;
    const input2 = this.input;
    wrapper.addEventListener("click", () => input2.focus());
    input2.addEventListener("focus", () => wrapper.classList.add("focus"));
    input2.addEventListener("blur", () => wrapper.classList.remove("focus"));
    input2.addEventListener("input", () => {
      this.appendTag();
      this.autowidth();
    });
    input2.addEventListener("blur", () => {
      this.appendTag(true);
      this.autowidth();
    });
    input2.addEventListener("keydown", (e) => {
      if (input2.value === "" && e.key === "Backspace" && wrapper.getElementsByClassName(this.classTag).length) {
        wrapper.querySelector(`.${this.classTag}:last-of-type`).remove();
        this.updateValue();
      }
      if (input2.value !== "" && e.key === "Enter" && this.enter) {
        this.appendTag(true);
        this.autowidth();
        e.preventDefault();
      }
    });
    wrapper.addEventListener("tagin:remove", (e) => {
      if (e["detail"] instanceof HTMLSpanElement) {
        e["detail"].parentElement.remove();
        this.updateValue();
      }
    });
    this.target.addEventListener("change", () => this.updateTag());
  }
  appendTag(force = false) {
    const input = this.input;
    const value = eval(this.transform)(input.value.trim());
    if (value === "")
      input.value = "";
    if (input.value.includes(this.separator) || force && input.value !== "") {
      value.split(this.separator).filter((i) => i !== "").forEach((val) => {
        if (this.getTags().includes(val) && this.duplicate === false) {
          this.alertExist(val);
        } else {
          input.insertAdjacentHTML("beforebegin", this.createTag(val));
          this.updateValue();
        }
      });
      input.value = "";
      input.removeAttribute("style");
    }
  }
  alertExist(value2) {
    for (const el of this.wrapper.getElementsByClassName(this.classTag)) {
      if (el.textContent === value2 && el instanceof HTMLSpanElement) {
        el.style.transform = "scale(1.09)";
        setTimeout(() => {
          el.removeAttribute("style");
        }, 150);
      }
    }
  }
  updateTag() {
    if (this.getValue() !== this.getTag()) {
      [...this.wrapper.getElementsByClassName(this.classTag)].map((tag) => tag.remove());
      this.getValue().trim() !== "" && this.input.insertAdjacentHTML("beforebegin", this.getValues().map((val) => this.createTag(val)).join(""));
    }
  }
  addTag(tag) {
    this.input.value = (Array.isArray(tag) ? tag.join(this.separator) : tag) + this.separator;
    this.input.dispatchEvent(new Event("input"));
  }
}
export { Tagin as default };
