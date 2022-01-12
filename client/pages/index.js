import Link from 'next/link';

const Home = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => {
    return(
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  );
}

Home.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default Home;

