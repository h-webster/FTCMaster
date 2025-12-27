export default function MatchDetails({activeMatch}) {
    const redMinor = activeMatch.score.red.minorFouls * 5;
    const redMajor = activeMatch.score.red.foulPointsCommitted - redMinor;
    const blueMinor = activeMatch.score.blue.minorFouls * 5;
    const blueMajor = activeMatch.score.blue.foulPointsCommitted - blueMinor;
 
    return (
        <>
            <tr className='total-row'>
                <td>Autonomous</td>
                <td>{activeMatch.score.red.autoPoints}</td>
                <td>{activeMatch.score.blue.autoPoints}</td>
            </tr>
            <tr>
                <td>Auto Classified Artifacts</td>
                <td>{activeMatch.score.red.autoClassifiedArtifacts}</td>
                <td>{activeMatch.score.blue.autoClassifiedArtifacts}</td>
            </tr>
            <tr>
                <td>Auto Overflow Artifacts</td>
                <td>{activeMatch.score.red.autoOverflowArtifacts}</td>
                <td>{activeMatch.score.blue.autoOverflowArtifacts}</td>
            </tr>
            <tr>
                <td>Auto Leave Points</td>
                <td>{activeMatch.score.red.autoLeavePoints}</td>
                <td>{activeMatch.score.blue.autoLeavePoints}</td>
            </tr>
            <tr>
                <td>Auto Pattern Points</td>
                <td>{activeMatch.score.red.autoPatternPoints}</td>
                <td>{activeMatch.score.blue.autoPatternPoints}</td>
            </tr>
            <tr>
                <td>Auto Artifact Points</td>
                <td>{activeMatch.score.red.autoArtifactPoints}</td>
                <td>{activeMatch.score.blue.autoArtifactPoints}</td>
            </tr>
            <tr className="total-row">
                <td>Teleop</td>
                <td>{activeMatch.score.red.teleopPoints}</td>
                <td>{activeMatch.score.blue.teleopPoints}</td>
            </tr>
            <tr>
                <td>Teleop Classified Artifacts</td>
                <td>{activeMatch.score.red.teleopClassifiedArtifacts}</td>
                <td>{activeMatch.score.blue.teleopClassifiedArtifacts}</td>
            </tr>
            <tr>
                <td>Teleop Overflow Artifacts</td>
                <td>{activeMatch.score.red.teleopOverflowArtifacts}</td>
                <td>{activeMatch.score.blue.teleopOverflowArtifacts}</td>
            </tr>
            <tr>
                <td>Teleop Depot Artifacts</td>
                <td>{activeMatch.score.red.teleopDepotPoints}</td>
                <td>{activeMatch.score.blue.teleopDepotPoints}</td>
            </tr>
            <tr>
                <td>Teleop Pattern Points</td>
                <td>{activeMatch.score.red.teleopPatternPoints}</td>
                <td>{activeMatch.score.blue.teleopPatternPoints}</td>
            </tr>
            <tr>
                <td>Teleop Artifact Points</td>
                <td>{activeMatch.score.red.teleopArtifactPoints}</td>
                <td>{activeMatch.score.blue.teleopArtifactPoints}</td>
            </tr>
            <tr className="total-row">
                <td>Penalties</td>
                <td>{activeMatch.score.red.foulPointsCommitted}</td>
                <td>{activeMatch.score.blue.foulPointsCommitted}</td>
            </tr>
           <tr>
                <td>Major Penalties</td>
                <td>
                    {redMajor}
                    {activeMatch.score.red.majorFouls !== 0 && ` (${activeMatch.score.red.majorFouls})`}
                </td>
                <td>
                    {blueMajor}
                    {activeMatch.score.blue.majorFouls !== 0 && ` (${activeMatch.score.blue.majorFouls})`}
                </td>
            </tr>
            <tr>
                <td>Minor Penalties</td>
                <td>
                    {redMinor}
                    {activeMatch.score.red.minorFouls !== 0 && ` (${activeMatch.score.red.minorFouls})`}
                </td>
                <td>
                    {blueMinor}
                    {activeMatch.score.blue.minorFouls !== 0 && ` (${activeMatch.score.blue.minorFouls})`}
                </td>
            </tr>
 
        </>
    );
}