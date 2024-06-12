import NavBar from "../../components/NavBar";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import "../../public/Statistics.css";

const StatisticsPage = () => {
  const { getUserStatistic, loading, error } = useApi();
  const [statistics, setStatistics] = useState(null);
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await getUserStatistic();
      if (response) {
        setStatistics(response);
      }
    };
    fetchStatistics();
  }, [getUserStatistic]);
  return (
    <div>
      <NavBar cart={cart} />
      <div className="container">
        <h2>Welcome to the Statistics Page</h2>

        {loading && <p>Loading...</p>}
        {error && <p> {error}</p>}
        {statistics && (
          <div className="statistics">
            <p>My Available Books: {statistics.availableBooks}</p>
            <p>My Unavailable Books: {statistics.unavailableBooks}</p>
            <p>My Orders: {statistics.orders}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
