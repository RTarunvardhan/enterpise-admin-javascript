export const generateColumns = (data) => {
    if (!data || data.length === 0) return [];
  
    const keys = Object.keys(data[0]);
  
    return keys.map((key) => {
      let maxLength = key.length;
  
      data.forEach((row) => {
        const val = row[key];
        if (val) {
          maxLength = Math.max(maxLength, String(val).length);
        }
      });
  
      const base = maxLength * 8;
  
      return {
        key,
        label: key.replace(/([A-Z])/g, " $1").toUpperCase(),
  
        // 🔥 dynamic width logic
        defaultWidth: Math.max(base * 1.5, 120),
        maxWidth: base * 5,
      };
    });
  };