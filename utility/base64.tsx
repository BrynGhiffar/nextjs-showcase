export const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString()!);
    reader.onerror = error => reject(error);
});

export async function extractBase64(files: FileList): Promise<string[]> {
  let base64s: string[] = [];
  if (files != null) {
    console.log(files);
    for (let fi = 0; fi < files.length; fi++) {
        const file = files[fi];
        const fileString = await toBase64(file);
        base64s.push(fileString);
    }
  }
  return base64s;
}