import { containerStyle } from '../styles/main'

export default () => <div style={containerStyle}>
  <h1>Chicago 1-Bedroom Apartment Prices</h1>

  <h2>0. Data Preparation</h2>
  <p>
    This work consist of two datasets:
    <br /><br />
    One extracted from <a href="https://www.zillow.com/research/data/" target="_blank">Zillow</a>,
    and then cleaned and merged using a custom python script. This dataset contains the relation zip code / prices.
    <br /><br />
    And the other extracted from <a href="https://www.census.gov/" target="_blank">census.gov</a>, and then prepared using
    topojson. This dataset contains the relation zip / geo coordinates.
  </p>

  <h2>1. Narrative</h2>
  <p>
    The Narrative selected is a <b>Drill Down Story</b>.
    <br /><br />
    On the first scene the user is presented with multiple options (one per zip code) and
    user is able to click on whatever Zip Code he/she is interested.
    <br /><br />
    On the second scene the user is presented with an histogram. From this scene user can return to
    previous scene or go to external sources: Google Maps & Trulia.
  </p>

  <h2>2. Scenes</h2>
  <p>
    The narrative consiste of two scenes. Both scenes follow same layout: <br />
    <ul>
      <li>Menu on Top</li>
      <li>Title</li>
      <li>Annotations</li>
      <li>Parameters</li>
      <li>Main Content</li>
    </ul>
  </p>

  <h2>3. Annotations</h2>
  <p>
    On both scenes Annotations help to detect:
    <ul>
      <li><b>Most Affordable</b> and <b>Most Expensive</b>. Using color and border.</li>
      <li>Both have a <b>hover</b> state to display more info about the area.</li>
    </ul>
  </p>

  <h2>4. Parameters</h2>
  <p>
    <b>Scene One</b> has as a parameter a dropdown to select different date.
    <br /><br />
    <b>Scene Two</b> has as a parameter a dropdown to select different Zip Code.
  </p>

  <h2>5. Triggers</h2>
  <p>
    <b>Scene One</b> has multiple triggers:
    <ul>
      <li>Date Dropdown to change selected date.</li>
      <li>Each area is <b>clickable</b> which takes user to the second scene.</li>
      <li>Star/Stop Animation, which change Date automatically. This way user can see an animation of how prices have changed among time.</li>
    </ul>
    <b>Scene Two</b> has as trigger the Zip Code dropdown, which helps user to select a different Zip Code.
    <br />
    As an extra, Scene Two has two external links to see more info about the area, one to Google Maps to show where the area is located and the second
    to see active listings on Trulia for the specific Zip Code.
  </p>
  <br /><br />
  <h3>Thanks for reading this and being an awesome classmate, cheers!</h3>
  <h4>Please keep in touch</h4>
  <p>
    <a href="https://www.linkedin.com/in/jaimegd/" target="_blank">Linkedin</a>
    <br />
    <a href="https://twitter.com/garciadiazjaime" target="_blank">Twitter</a>
    <br />
    <a href="https://github.com/garciadiazjaime/d3-chicago-listings" target="_blank">Github</a>
  </p>
  <style global jsx>{`
    h2 {
      font-weight: 500;
    }
    p {
      font-size: 18px;
      padding-left: 20px;
    }
  `}</style>
</div>
