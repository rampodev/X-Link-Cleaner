(() => {
  const X_HOST = /(^|\.)(x|twitter)\.com$/;
  const TRACKING_PARAMS = ["a", "s", "t"];

  function cleanUrl(text) {
    if (typeof text !== "string") return null;
    const trimmed = text.trim();
    if (!/^https?:\/\/\S+$/i.test(trimmed)) return null;
    const url = URL.parse(trimmed);
    if (!url || !X_HOST.test(url.hostname)) return null;

    url.protocol = "https:";
    url.hostname = "fixupx.com";
    TRACKING_PARAMS.forEach((param) => url.searchParams.delete(param));
    if (url.searchParams.size === 0) url.search = "";
    return url.toString();
  }

  const cleanUrlsInText = (text) =>
    typeof text === "string" ? text.replace(/https?:\/\/\S+/gi, (match) => cleanUrl(match) ?? match) : text;

  const { writeText, write } = Clipboard.prototype;

  Clipboard.prototype.writeText = function (text) {
    return writeText.call(this, cleanUrl(text) ?? text);
  };

  Clipboard.prototype.write = function (items) {
    return write.call(this, Array.isArray(items) ? items.map(cleanClipboardItem) : items);
  };

  function cleanClipboardItem(item) {
    if (!(item instanceof ClipboardItem) || !item.types.includes("text/plain")) return item;
    const data = Object.fromEntries(item.types.map((type) => [type, item.getType(type)]));
    data["text/plain"] = data["text/plain"]
      .then((blob) => blob.text())
      .then((text) => new Blob([cleanUrl(text) ?? text], { type: "text/plain" }));
    return new ClipboardItem(data);
  }

  const { share } = Navigator.prototype;

  if (share) {
    Navigator.prototype.share = function (data) {
      return share.call(this, typeof data === "object" && data !== null ? cleanShareData(data) : data);
    };
  }

  function cleanShareData(data) {
    const cleaned = { ...data };
    if ("url" in data) cleaned.url = cleanUrl(data.url) ?? data.url;
    if ("text" in data) cleaned.text = cleanUrlsInText(data.text);
    return cleaned;
  }

  document.addEventListener(
    "copy",
    (event) => {
      if (document.activeElement?.isContentEditable) return;
      const cleaned = cleanUrl(selectedText());
      if (!cleaned || !event.clipboardData) return;
      event.clipboardData.setData("text/plain", cleaned);
      event.preventDefault();
    },
    true,
  );

  function selectedText() {
    const el = document.activeElement;
    const isTextField = el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement;
    return isTextField && el.selectionStart !== null
      ? el.value.slice(el.selectionStart, el.selectionEnd)
      : String(getSelection());
  }
})();
