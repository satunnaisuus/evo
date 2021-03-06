import * as React from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Parameters } from "./parameters";
import { useContext } from "react";
import { SimulationContext } from "../context";
import { Info } from "./info";
import { SelectedCell } from "./selected-cell";

const Container = styled.div`
    position: absolute;
    top: 50px;
    left: 0;
    bottom: 0;
    pointer-events: none;
    width: 100%;
`;

const StyledBox = styled.div`
    border-radius: 6px;
    background: rgba(16, 22, 30, 0.9);
    padding: 16px;
    width: 240px;
    position: absolute;
    top: 10px;
    right: 10px;
    pointer-events: all;
    max-height: 100%;
    overflow-y: auto;
`;

const StyledSidebar = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    overflow-y: auto;
    pointer-events: all;
    padding: 16px;
    background: rgb(29, 37, 49);
    width: 320px;
`;


interface Props {
    
}

export const Overlay = observer(({}: Props) => {
    const simulation = useContext(SimulationContext);
    const ui = simulation.getUI();

    return (
        <Container>
            {ui.isInfoOpened() && (
                <StyledBox>
                    <Info />
                </StyledBox>
            )}

            {ui.isTabActive('parameters') && (
                <StyledSidebar>
                    <Parameters />
                </StyledSidebar>
            )}

            {ui.isTabActive('cell') && (
                <StyledSidebar>
                    <SelectedCell />
                </StyledSidebar>
            )}
        </Container>
    );
});