import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RoutesArray } from './RoutesArr';

const renderRoute = route => {
  if (route.children) {
    return (
      <Route key={route.id} path={route.path} element={route.element}>
        {route.children.map(renderRoute)}
      </Route>
    );
  }
  return <Route key={route.id} path={route.path} element={route.element} index={route.index} />;
};

export default function RoutesPages() {
  return <Routes>{RoutesArray.map(renderRoute)}</Routes>;
}
