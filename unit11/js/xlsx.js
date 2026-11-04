(function (root) {
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function colName(index) {
    var name = "";
    var n = index + 1;
    while (n > 0) {
      var rem = (n - 1) % 26;
      name = String.fromCharCode(65 + rem) + name;
      n = Math.floor((n - 1) / 26);
    }
    return name;
  }

  function crc32(bytes) {
    if (!crc32.table) {
      var table = new Uint32Array(256);
      for (var n = 0; n < 256; n += 1) {
        var c = n;
        for (var k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        table[n] = c >>> 0;
      }
      crc32.table = table;
    }
    var crc = 0xffffffff;
    for (var i = 0; i < bytes.length; i += 1) crc = crc32.table[(crc ^ bytes[i]) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function dosStamp(date) {
    var d = date || new Date();
    var time = ((d.getHours() & 31) << 11) | ((d.getMinutes() & 63) << 5) | (Math.floor(d.getSeconds() / 2) & 31);
    var day = (((d.getFullYear() - 1980) & 127) << 9) | (((d.getMonth() + 1) & 15) << 5) | (d.getDate() & 31);
    return { time: time, day: day };
  }

  function u16(view, offset, value) {
    view.setUint16(offset, value, true);
  }

  function u32(view, offset, value) {
    view.setUint32(offset, value, true);
  }

  function zipStore(files) {
    var encoder = new TextEncoder();
    var stamp = dosStamp(new Date());
    var parts = [];
    var central = [];
    var offset = 0;
    files.forEach(function (file) {
      var name = encoder.encode(file.name);
      var data = typeof file.data === "string" ? encoder.encode(file.data) : file.data;
      var crc = crc32(data);
      var local = new Uint8Array(30 + name.length + data.length);
      var view = new DataView(local.buffer);
      u32(view, 0, 0x04034b50);
      u16(view, 4, 20);
      u16(view, 6, 0);
      u16(view, 8, 0);
      u16(view, 10, stamp.time);
      u16(view, 12, stamp.day);
      u32(view, 14, crc);
      u32(view, 18, data.length);
      u32(view, 22, data.length);
      u16(view, 26, name.length);
      u16(view, 28, 0);
      local.set(name, 30);
      local.set(data, 30 + name.length);
      parts.push(local);

      var dir = new Uint8Array(46 + name.length);
      var dirView = new DataView(dir.buffer);
      u32(dirView, 0, 0x02014b50);
      u16(dirView, 4, 20);
      u16(dirView, 6, 20);
      u16(dirView, 8, 0);
      u16(dirView, 10, 0);
      u16(dirView, 12, stamp.time);
      u16(dirView, 14, stamp.day);
      u32(dirView, 16, crc);
      u32(dirView, 20, data.length);
      u32(dirView, 24, data.length);
      u16(dirView, 28, name.length);
      u16(dirView, 30, 0);
      u16(dirView, 32, 0);
      u16(dirView, 34, 0);
      u16(dirView, 36, 0);
      u32(dirView, 38, 0);
      u32(dirView, 42, offset);
      dir.set(name, 46);
      central.push(dir);
      offset += local.length;
    });
    var centralSize = central.reduce(function (sum, part) { return sum + part.length; }, 0);
    var end = new Uint8Array(22);
    var endView = new DataView(end.buffer);
    u32(endView, 0, 0x06054b50);
    u16(endView, 4, 0);
    u16(endView, 6, 0);
    u16(endView, 8, files.length);
    u16(endView, 10, files.length);
    u32(endView, 12, centralSize);
    u32(endView, 16, offset);
    u16(endView, 20, 0);
    var total = offset + centralSize + end.length;
    var out = new Uint8Array(total);
    var cursor = 0;
    parts.concat(central, [end]).forEach(function (part) {
      out.set(part, cursor);
      cursor += part.length;
    });
    return out;
  }

  function sheetXml(rows) {
    var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
    xml += "<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\">";
    xml += "<sheetViews><sheetView rightToLeft=\"1\" workbookViewId=\"0\"/></sheetViews>";
    xml += "<sheetFormatPr defaultColWidth=\"22\"/>";
    xml += "<sheetData>";
    rows.forEach(function (row, r) {
      xml += "<row r=\"" + (r + 1) + "\">";
      row.forEach(function (cell, c) {
        var ref = colName(c) + (r + 1);
        if (typeof cell === "number" && isFinite(cell)) {
          xml += "<c r=\"" + ref + "\"><v>" + cell + "</v></c>";
        } else {
          xml += "<c r=\"" + ref + "\" t=\"inlineStr\"><is><t xml:space=\"preserve\">" + esc(cell) + "</t></is></c>";
        }
      });
      xml += "</row>";
    });
    xml += "</sheetData></worksheet>";
    return xml;
  }

  function build(sheets) {
    var content = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
    content += "<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">";
    content += "<Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/>";
    content += "<Default Extension=\"xml\" ContentType=\"application/xml\"/>";
    content += "<Override PartName=\"/xl/workbook.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\"/>";
    sheets.forEach(function (sheet, index) {
      content += "<Override PartName=\"/xl/worksheets/sheet" + (index + 1) + ".xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>";
    });
    content += "</Types>";

    var rels = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
    rels += "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">";
    rels += "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"xl/workbook.xml\"/>";
    rels += "</Relationships>";

    var workbook = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
    workbook += "<workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\">";
    workbook += "<sheets>";
    sheets.forEach(function (sheet, index) {
      workbook += "<sheet name=\"" + esc(sheet.name) + "\" sheetId=\"" + (index + 1) + "\" r:id=\"rId" + (index + 1) + "\"/>";
    });
    workbook += "</sheets></workbook>";

    var bookRels = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
    bookRels += "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">";
    sheets.forEach(function (sheet, index) {
      bookRels += "<Relationship Id=\"rId" + (index + 1) + "\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet" + (index + 1) + ".xml\"/>";
    });
    bookRels += "</Relationships>";

    var files = [
      { name: "[Content_Types].xml", data: content },
      { name: "_rels/.rels", data: rels },
      { name: "xl/workbook.xml", data: workbook },
      { name: "xl/_rels/workbook.xml.rels", data: bookRels }
    ];
    sheets.forEach(function (sheet, index) {
      files.push({ name: "xl/worksheets/sheet" + (index + 1) + ".xml", data: sheetXml(sheet.rows) });
    });
    return zipStore(files);
  }

  root.U11Xlsx = { build: build };
})(typeof globalThis !== "undefined" ? globalThis : this);
