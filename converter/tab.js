const generate = require("nanoid/generate");

exports.sheets = async (sheet) => {
  try {
    const rows = await sheet.getRows();
    const data = rows
      .map((row) => ({
        _headerValues: row._worksheet._headerValues,
        _rawData: row._rawData,
      }))
      .map((row) => {
        const obj = {};
        row._headerValues.forEach((header, index) => {
          obj[header] = row._rawData[index];
        });
        return obj;
      });
    return {
      // Push
      push: async (id, body) => {
        try {
          const obj = {
            id,
            ...body,
            date: new Date().getTime(),
            update: "",
          };
          const result = await sheet.addRow(obj);
          if (!result) throw error;
          return {
            status: true,
            content: { id, date: new Date().getTime(), ...body },
          };
        } catch (error) {
          return { status: false, content: error };
        }
      },
      // Create
      create: async (id, body) => {
        try {
          const find = data.find((i) => i.id === id);
          const findName = data.find((i) => i.name.toLowerCase() === body.name.toLowerCase());
          if (find || findName) throw "Duplicate Data!";
          const obj = {
            id,
            ...body,
            date: new Date().getTime(),
            update: "",
          };
          const result = await sheet.addRow(obj);
          if (!result) throw error;
          return {
            status: true,
            content: { id, date: new Date().getTime(), ...body },
          };
        } catch (error) {
          return { status: false, content: error };
        }
      },
      // Create
      customCreate: async (custom, id, body) => {
        try {
          const find = data.find((i) => i.id === id);
          const findCustom = data.find((i) => i[custom].toLowerCase() === body[custom].toLowerCase());
          if (find || findCustom) throw "Duplicate Data!";
          const obj = {
            id,
            ...body,
            date: new Date().getTime(),
            update: "",
          };
          const result = await sheet.addRow(obj);
          if (!result) throw error;
          return {
            status: true,
            content: { id, date: new Date().getTime(), ...body },
          };
        } catch (error) {
          return { status: false, content: error };
        }
      },
      // Read
      read: async (id) => {
        if (id) {
          try {
            const find = data.find((i) => i.id === id);
            const findIndex = data.findIndex((i) => i.id === id);
            if (!find) throw "Data not found!";
            return { status: true, content: { ...find, index: findIndex } };
          } catch (error) {
            return { status: false, content: error };
          }
        } else {
          try {
            return { status: true, content: data };
          } catch (error) {
            return { status: false, content: error };
          }
        }
      },
      // Read
      status: async (id) => {
        if (id) {
          try {
            const find = data.find((i) => i.id === id);
            const findIndex = data.findIndex((i) => i.id === id);
            if (!find) throw "Data not found!";
            return find.isAdmin === "TRUE" ? "isAdmin" : find.isStaff === "TRUE" ? "isStaff" : "isMember";
          } catch (error) {
            return { status: false, content: error };
          }
        } else {
          try {
            return { status: true, content: data };
          } catch (error) {
            return { status: false, content: error };
          }
        }
      },
      // Read
      customRead: async (custom, id) => {
        if (id) {
          try {
            const find = data.find((i) => i[custom] === id);
            const findIndex = data.findIndex((i) => i[custom] === id);
            if (!find) throw "Data not found!";
            return { status: true, content: { ...find, index: findIndex } };
          } catch (error) {
            return { status: false, content: error };
          }
        } else {
          try {
            return { status: true, content: data };
          } catch (error) {
            return { status: false, content: error };
          }
        }
      },
      // Update
      update: async (id, body) => {
        try {
          const find = data.find((i) => i.id === id);
          const findIndex = data.findIndex((i) => i.id === id);
          if (!find) throw "Data not found!";
          delete body["id"];
          const obj = Object.assign(find, {
            ...body,
            update: new Date().getTime(),
          });
          rows[findIndex].assign(obj);
          await rows[findIndex].save();
          return {
            status: true,
            content: { id, update: new Date().getTime(), ...body },
          };
        } catch (error) {
          return { status: false, content: error };
        }
      },
      // Delete
      delete: async (id) => {
        try {
          const find = data.find((i) => i.id === id);
          const findIndex = data.findIndex((i) => i.id === id);
          if (!find) throw "Data not found!";
          await rows[findIndex].delete();
          return { status: true, content: find };
        } catch (error) {
          return { status: false, content: error };
        }
      },
    };
  } catch (error) {
    return { status: false, content: error.message };
  }
};

exports.getDataForPage = async (page, result) => {
  const startIndex = (page - 1) * 5;
  const endIndex = startIndex + 5;
  return result.content.slice(startIndex, endIndex);
};

exports.getId = (custom, number) => {
  const id = generate(custom, number);
  return id;
};
