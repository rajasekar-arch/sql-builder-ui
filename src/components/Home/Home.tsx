import { Link } from 'react-router-dom';
import Card from '../Card/Card';

const sqlFeatures = [
  { title: 'DDL (Create, Alter, Drop)', path: '/ddl' },
  { title: 'DML (Insert, Update, Delete)', path: '/dml' },
  { title: 'DCL & TCL (Grant, Commit, etc.)', path: '/dcl-tcl' },
  { title: 'Joins', path: '/joins' },
  { title: 'Subqueries', path: '/subqueries' },
//   { title: 'Aggregate Functions', path: '/aggregates' },
  { title: 'String / Date / Time Functions', path: '/functions' },
//   { title: 'Set Operations (Union, Intersect)', path: '/set-operations' },
  { title: 'Common Table Expressions (CTE)', path: '/cte' },
  { title: 'Schema Visualizer', path: '/schema-visualizer' },
//   { title: 'Query Editor', path: '/editor' },
//   { title: 'Saved Queries / History', path: '/history' },
];

const Home = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">SQL Builder Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sqlFeatures.map((feature, index) => (
          <Link key={index} to={feature.path}>
            <Card title={feature.title} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
