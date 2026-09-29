/// app/page.tsx (Next.js App Router - Server Component)
export default async function Page() {
  const spreadsheetId = '1PrSgUxEFJE9rW8i5uTx44PYJc-4uOfNuk9oZLGsxpOA';
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`

  const res = await fetch(url, { next: { cache: 'no-store' } });
  const text = await res.text();

  const json = JSON.parse(text.substring(47, text.length - 2));
  const rows = json.table.rows.map((row) => row.c.map((cell) => cell?.v));

  const filteredRows = rows.map(row => ({
    timestamp: row[0],
    email: row[1],
    score: row[2],
    enrollmentNo: row[3],
    name: row[4]
  }))

  const formatDate = (raw) => {
    // const raw = "Date(2026,8,29,13,32,12)";

    const [year, month, day, hours24, minutes, seconds] = raw.match(/\d+/g);

    const hours12 = String((parseInt(hours24, 10) % 12) || 12).padStart(2, '0');

    // Format as DD/MM/YYYY HH:MM:SS
    const pad = (num) => String(num).padStart(2, '0');
    const formatted = `${pad(day)}/${pad(month)}/${year} ${hours12}:${pad(minutes)}:${pad(seconds)}`;

    return (formatted);
  }

  console.log("rows:", rows)
  console.log("excat:", filteredRows)
  console.log("excatlt:", Math.max(...filteredRows.map(item => item.score)))

  return (
    <div>
      <h1>Sheet Data</h1>
      {/* <pre>{JSON.stringify(filteredRows, null, 2)}</pre> */}
      <table>
        <caption>Example Data Table Caption</caption>
        <thead>
          <tr>
            <th scope="col">Sr No</th>
            <th scope="col">Enrollment No</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Score</th>
            <th scope="col">Timestamp</th>

          </tr>
        </thead>
        <tbody>
          {filteredRows.sort((itemA, itemB)=> itemB.score - itemA.score).map((row, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{row.enrollmentNo}</td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.score}</td>
              <td>{formatDate(row.timestamp)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total Responses</td>
            <td>{filteredRows.length}</td>
            <td>Highest till Now</td>
            <td>{Math.max(...filteredRows.map(item => item.score))}</td>
          </tr>
        </tfoot>
      </table>

      <h2>current topper</h2>
{filteredRows.sort((itemA, itemB)=> itemB.score - itemA.score).slice(0,1).map((row, index) => (
            <div key={index}>
              <h3>{index + 1}</h3>
              <h3>{row.enrollmentNo}</h3>
              <h3>{row.name}</h3>
              <h3>{row.email}</h3>
              <h3>{row.score}</h3>
              <h3>{formatDate(row.timestamp)}</h3>
            </div>
          ))}
    </div>
  );
}