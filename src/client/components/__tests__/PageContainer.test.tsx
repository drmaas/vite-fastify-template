// Copyright 2025 Daniel Maas
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     https://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageContainer from '../PageContainer';

describe('PageContainer', () => {
  it('renders children correctly', () => {
    render(
      <PageContainer>
        <div data-testid="test-child">Test Content</div>
      </PageContainer>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default styles', () => {
    render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    const container = screen.getByText('Content').closest('.flex');
    expect(container).toHaveClass('flex', 'justify-left', 'mt-10');
    
    const innerContainer = screen.getByText('Content').closest('.w-full');
    expect(innerContainer).toHaveClass('w-full', 'p-8', 'rounded-lg', 'shadow-lg');
  });

  it('accepts additional className prop', () => {
    render(
      <PageContainer className="custom-class bg-gray-100">
        <div>Content</div>
      </PageContainer>
    );
    
    const container = screen.getByText('Content').closest('.flex');
    expect(container).toHaveClass('custom-class', 'bg-gray-100');
  });
}); 