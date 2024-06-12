import NavBar from '../../components/NavBar';
import useAuth from '../../hooks/useAsync';
import { useEffect, useState } from 'react';
import '../../public/Statistics.css'; 

const StatisticsPage = () => {
  const { getMyStatistic, loading, error, } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  })

  useEffect(() => {
      const fetchStatistics = async () => {
        const response = await getMyStatistic();
        if (response) {
          setStatistics(response);
        }
      };
      fetchStatistics();
    
  }, [getMyStatistic ]);

  return (
    <div> 
       <NavBar cart={cart} />
    <div  className="container">
    
      <h2>Welcome to the Statistics Page</h2>
    
          {loading && <p>Loading...</p>}
          {error && <p> {error}</p>}
          {statistics && (
            <div className="statistics">
              <p>My Available Books: {statistics.availableBook}</p>
              <p>My Unavailable Books: {statistics.UnAvailableBook}</p>
              <p>My Orders: {statistics.MyOrders}</p>
            </div>
          )}
    </div>
    </div>
  );
};


export default StatisticsPage;
