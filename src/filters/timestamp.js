export default function (time) {
  let date = new Date(time*1000);
  //console.log(date);
  let y = date.getFullYear();
  let MM  = date.getMonth()+1;
  MM = MM < 10 ? ('0' + MM) : MM; // 判斷弝
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  let timestamp = `${y}/${MM}/${d}`;
  return timestamp;
}