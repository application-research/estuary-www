import styles from '@components/Table.module.scss';

const columTitles = [
  {
    title: 'Deals',
  },
  {
    title: 'Errors',
  },
];

function Table({ value, href }) {
  return (
    // <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
    //   <div className={styles.column}>
    //     <span className={styles.tableTitle}>Index</span>
    //   </div>

    //   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
    //     <div className={styles.column}>
    //       <span className={styles.tableLink}>
    //         <a className={styles.link} href={href}>
    //           {value}
    //         </a>
    //       </span>
    //     </div>
    //   </div>
    // </div>
    <table className={styles.table}>
      {/* array of headings */}
      <tr>
        <th></th>

        {columTitles.map((title) => {
          // console.log(columTitles.title);
          // console.log(columTitles);

          return (
            <th scope="col" className={styles.th}>
              test
            </th>
          );
        })}
      </tr>
      {/* array of rows */}
      {/* <tr>
        <td className={styles.td}>1</td>
        <td>Jan - April</td>
        <td>Credit</td>
      </tr>
      <tr>
        <td>2</td>
        <td>May - August</td>
        <td>Pass</td>
      </tr>
      <tr>
        <td>2</td>
        <td>September - December</td>
        <td>Distinction</td>
      </tr> */}
    </table>
  );
}

export default Table;
