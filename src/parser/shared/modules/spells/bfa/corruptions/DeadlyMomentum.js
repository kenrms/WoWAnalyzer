import React from 'react';

import SPELLS from 'common/SPELLS/index';
import { formatNumber } from 'common/format';
import Analyzer from 'parser/core/Analyzer';
import StatTracker from 'parser/shared/modules/StatTracker';
import CriticalIcon from 'interface/icons/CriticalStrike';
import ItemStatistic from 'interface/statistics/ItemStatistic';
import BoringSpellValueText from 'interface/statistics/components/BoringSpellValueText';

// yes these are static
const T1_STATS = 31;
const T2_STATS = 41;
const T3_STATS = 72;

class DeadlyMomentum extends Analyzer {
  static dependencies = {
    statTracker: StatTracker,
  };

  statAmount = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasCorruptionByName("Deadly Momentum");
    if (!this.active) {
      return;
    }

    this.statAmount += this.selectedCombatant.getCorruptionCount(SPELLS.DEADLY_MOMENTUM_T1.id) * T1_STATS;
    this.statAmount += this.selectedCombatant.getCorruptionCount(SPELLS.DEADLY_MOMENTUM_T2.id) * T2_STATS;
    this.statAmount += this.selectedCombatant.getCorruptionCount(SPELLS.DEADLY_MOMENTUM_T3.id) * T3_STATS;

    this.statTracker.add(SPELLS.DEADLY_MOMENTUM_BUFF.id, {
      crit: this.statAmount,
    });
  }

  get weightedBuffUptime() {
    return this.selectedCombatant.getStackWeightedBuffUptime(SPELLS.DEADLY_MOMENTUM_BUFF.id) / this.owner.fightDuration;
  }

  statistic() {
    return (
      <ItemStatistic size="flexible">
        <BoringSpellValueText spell={SPELLS.DEADLY_MOMENTUM_BUFF}>
          <CriticalIcon /> {formatNumber(this.weightedBuffUptime * this.statAmount)} <small>average Crit</small>
        </BoringSpellValueText>
      </ItemStatistic>
    );
  }
}

export default DeadlyMomentum;
