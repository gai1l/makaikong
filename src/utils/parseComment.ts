export function parseComment(message: string) {
  // ลบช่องว่างทั้งหมด
  const cleaned = message.replace(/\s+/g, "");

  // แยก productCode กับ quantity
  const match = cleaned.match(/^([A-Za-z0-9]+?)(?:x(\d+))?$/i);

  if (!match) {
    return null;
  }

  return {
    productCode: match[1],
    quantity: match[2] ? Number(match[2]) : 1,
  };
}
