import React, { useState, useEffect, createRef } from 'react'
import PropTypes from 'prop-types'
import LocationCard from './location-card';
import { FixedSizeList as List } from 'react-window';
import { EuiSearchBar, EuiSpacer, EuiSuperSelect, EuiHealth, EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiHorizontalRule } from '@elastic/eui';
import AutoSizer from 'react-virtualized-auto-sizer';
import { getColor } from '../../helpers/color';
import './locations.css';

const optionDisplay = (value, display) => (
  <EuiHealth color={getColor(value)} style={{ lineHeight: 'inherit' }}>
    {display}
  </EuiHealth>
);

const options = [
  {
    value: 'name',
    inputDisplay: optionDisplay('name',  'Name'),
  },
  {
    value: 'confirmed',
    inputDisplay: optionDisplay('confirmed',  'Confirmed'),
  },
  {
    value: 'recovered',
    inputDisplay: optionDisplay('recovered',  'Recovered'),
  },
  {
    value: 'deaths',
    inputDisplay: optionDisplay('deaths',  'Deaths'),
  },
  {
    value: 'active',
    inputDisplay: optionDisplay('active',  'Active'),
  },
  {
    value: 'recoveredRate',
    inputDisplay: optionDisplay('recoveredRate',  'Recovery Rate'),

  },
  {
    value: 'deathsRate',
    inputDisplay: optionDisplay('deathsRate',  'Death Rate'),
  },
  {
    value: 'activeRate',
    inputDisplay: optionDisplay('activeRate',  'Active Rate'),
  },
  {
    value: 'perCapita',
    inputDisplay: optionDisplay('perCapita',  'Per 100,000'),
  },
  {
    value: 'confirmedIncrease',
    inputDisplay: optionDisplay('confirmedIncrease',  'Confirmed Increase'),
  },
  {
    value: 'recoveredIncrease',
    inputDisplay: optionDisplay('recoveredIncrease',  'Recovered Increase'),
  },
  {
    value: 'deathsIncrease',
    inputDisplay: optionDisplay('deathsIncrease',  'Deaths Increase'),
  },
  {
    value: 'activeIncrease',
    inputDisplay: optionDisplay('activeIncrease',  'Active Increase'),
  },
  {
    value: 'confirmedIncreasePercent',
    inputDisplay: optionDisplay('confirmedIncreasePercent',  'Confirmed Increase (%)'),
  },
  {
    value: 'recoveredIncreasePercent',
    inputDisplay: optionDisplay('recoveredIncreasePercent',  'Recovered Increase (%)'),
  },
  {
    value: 'deathsIncreasePercent',
    inputDisplay: optionDisplay('deathsIncreasePercent',  'Deaths Increase (%)'),
  },
  {
    value: 'activeIncreasePercent',
    inputDisplay: optionDisplay('activeIncreasePercent',  'Active Increase (%)'),
  },
];

const initialQuery = EuiSearchBar.Query.MATCH_ALL;

const Locations = ({ data, onRowClick, isProvince, displayStat, setDisplayStat, selected }) => {
  const [descend, setDescend] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState('confirmed');
  const listRef = createRef();

  const setSelected = (option) => {
    if (option === 'name') {
      setSelected('confirmed');
    } else {
      setDisplayStat(option);
    }
    setSort(option);
    listRef.current.scrollToItem(0);
  }

  const invertSort = () => {
    setDescend(!descend);
    listRef.current.scrollToItem(0);
  }

  useEffect(() => {
    setQuery(initialQuery);
  }, [selected]);

  let location;
  if (isProvince) {
    location = 'province';
  } else {
    location = 'country';
  }

  let filteredData;
  if (query !== initialQuery && query !== null) {
    filteredData = data.filter((item) => {
      return item.location[location].toLowerCase().includes(query.text.toLowerCase());
    });
  } else {
    filteredData = data;
  }

  let sortFunction, icon;

  if (descend) {
    if ( sort === 'name') {
      sortFunction = (a, b) => b.location[location].localeCompare(a.location[location]);
    } else {
      sortFunction = (a, b) => a.latest[sort] - b.latest[sort];
    }
    icon = 'sortDown'
  } else {
    if ( sort === 'name') {
      sortFunction = (a, b) => a.location[location].localeCompare(b.location[location]);
    } else {
      sortFunction = (a, b) => b.latest[sort] - a.latest[sort];
    }
    icon = 'sortUp'
  }
  
  let isPercentage = false;
  if (displayStat.includes('Rate') || displayStat.includes('Percent')) {
    isPercentage = true;
  }

  const sortedData = filteredData.sort(sortFunction);

  const Row = ({ index, style }) => {
    const item = sortedData[index];
    const key = item.key;
    const itemLocation = item.location[location];
    const itemStat = item.latest[displayStat];

    return (
      <div style={{
        ...style,
        top: `${parseFloat(style.top) + 12}px`,
        paddingLeft: 8,
        paddingRight: 8,
      }}>
        <LocationCard 
          onRowClick={onRowClick} 
          locationKey={key} 
          location={itemLocation} 
          stat={itemStat} 
          position={index+1} 
          isPercentage={isPercentage}
          color={getColor(displayStat)}
        />
      </div>
    )
  };

  return (
    <>
      <div>
        <EuiSearchBar
          defaultQuery={initialQuery}
          query={query}
          box={{
            placeholder: 'Search for a location...',
            incremental: true,
          }}
          onChange={({query, error}) => setQuery(query)}
        />
        <EuiSpacer size="s"/>
        <EuiFlexGroup responsive={false} gutterSize="s" alignItems="center">
          <EuiFlexItem>
            <EuiSuperSelect
              fullWidth
              options={options}
              valueOfSelected={sort}
              onChange={(option) => setSelected(option)}
              compressed
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonIcon
              aria-label={icon}
              iconType={icon}
              onClick={() => invertSort()}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiHorizontalRule margin="s" style={{ marginBottom: 0 }}/>
      </div>
      <div className="auto-sizer">
        <AutoSizer>
          {({ height, width }) => (
            <List
              ref={listRef}
              height={height}
              itemCount={sortedData.length}
              itemSize={65}
              width={width}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>
    </>
  )
}

Locations.propTypes = {
  onRowClick: PropTypes.func,
  data: PropTypes.array,
  isProvince: PropTypes.bool,
  displayStat: PropTypes.string,
  setDisplayStat: PropTypes.func,
  selected: PropTypes.string,
}

export default Locations;
